import { resolve } from "path"
import { writeFile } from "fs/promises"
import { tmpdir } from "os"

import { wdi5Config, wdi5Selector } from "../types/wdi5.types"
import { WDI5 } from "./WDI5"

import { Logger as _Logger } from "./Logger"
import { os } from "sap/ui/Device"
const Logger = _Logger.getInstance()

/** @type {Boolean} store the status of initialization */
let _isInitialized = false
/** @type {Boolean} stores the status of the setup process */
let _setupComplete = false
/** @type {String} currently running sap.ui.version */
let _sapUI5Version = null
/** relay runtime config options from Service */
let _config: wdi5Config = null

export async function setup(config: wdi5Config) {
    _config = config
    if (_setupComplete) {
        // already setup done
        return
    }
    // jump-start the desired log level
    Logger.setLogLevel(config.wdi5.logLevel)

    // init control cache
    if (!browser._controls) {
        Logger.info("creating internal control map")
        browser._controls = []
    }

    addWdi5Commands()

    _setupComplete = true
}

export async function start(config: wdi5Config) {
    // TODO: document that we require wdio.config.baseUrl with a trailing slash à la "http://localhost:8080/"
    if (config.wdi5.url !== "") {
        Logger.info(`open url: ${config.wdi5.url}`)
        await browser.url(config.wdi5.url)
    } else {
        Logger.info("open url with fallback '#' (this is not causing any issues since its is removed for navigation)")
        await browser.url("#")
    }
}

/**
 * function library to setup the webdriver to UI5 bridge, it runs alle the initial setup
 * make sap/ui/test/RecordReplay accessible via wdio
 * attach the sap/ui/test/RecordReplay object to the application context window object as 'bridge'
 */
export async function injectUI5(config: wdi5Config) {
    const waitForUI5Timeout = config.wdi5.waitForUI5Timeout || 15000
    // expect boolean
    const result = await browser.executeAsync((waitForUI5Timeout, done) => {
        if (window.bridge) {
            // setup sap testing already done
            done(true)
        }

        if (!window.sap || !window.sap.ui) {
            // setup sap testing already cant be done due to sap namespace not present on the page
            console.error("[browser wdi5] ERR: no ui5 present on page")

            // only condition where to cancel the setup process
            done(false)
        }

        // attach the function to be able to use the extracted method later
        if (!window.bridge) {
            // create empty
            window.wdi5 = {
                createMatcher: null,
                isInitialized: false,
                Log: null,
                waitForUI5Options: {
                    timeout: waitForUI5Timeout,
                    interval: 400
                }
            }

            // load UI5 logger
            sap.ui.require(["sap/base/Log"], (Log) => {
                // Logger is loaded -> can be use internally
                // attach logger to wdi5 to be able to use it globally
                window.wdi5.Log = Log
                window.wdi5.Log.info("[browser wdi5] injected!")
            })

            // attach new bridge
            sap.ui.require(["sap/ui/test/RecordReplay"], (RecordReplay) => {
                window.bridge = RecordReplay
                window.wdi5.Log.info("[browser wdi5] injected!")
                window.wdi5.isInitialized = true

                // here setup is successfull
                // known side effect this call triggers the back to node scope, the other sap.ui.require continue to run in background in browser scope
                done(true)
            })
            // make sure the resources are required
            sap.ui.require(
                [
                    "sap/ui/test/matchers/BindingPath",
                    "sap/ui/test/matchers/I18NText",
                    "sap/ui/test/matchers/Properties",
                    "sap/ui/test/matchers/Ancestor",
                    "sap/ui/test/matchers/LabelFor"
                ],
                (BindingPath, I18NText, Properties, Ancestor, LabelFor) => {
                    /**
                     * used to dynamically create new control matchers when searching for elements
                     */
                    window.wdi5.createMatcher = (oSelector) => {
                        // Before version 1.60, the only available criteria is binding context path.
                        // As of version 1.72, it is available as a declarative matcher
                        const oldAPIVersion = 1.6
                        // check whether we're looking for a control via regex
                        // hint: no IE support here :)
                        if (oSelector.id && oSelector.id.startsWith("/", 0)) {
                            const [sTarget, sRegEx, sFlags] = oSelector.id.match(/\/(.*)\/(.*)/)
                            oSelector.id = new RegExp(sRegEx, sFlags)
                        }

                        // match a regular regex as (partial) matcher
                        // properties: {
                        //     text: /.*ersi.*/gm
                        // }
                        // but not a declarative style regex matcher
                        // properties: {
                        //     text: {
                        //         regex: {
                        //             source: '.*ersi.*',
                        //             flags: 'gm'
                        //         }
                        //     }
                        // }
                        if (
                            typeof oSelector.properties?.text === "string" &&
                            oSelector.properties?.text.startsWith("/", 0)
                        ) {
                            const [_, sRegEx, sFlags] = oSelector.properties.text.match(/\/(.*)\/(.*)/)
                            oSelector.properties.text = new RegExp(sRegEx, sFlags)
                        }

                        if (oSelector.bindingPath) {
                            // TODO: for the binding Path there is no object creation
                            // fix (?) for 'leading slash issue' in propertyPath w/ a named model
                            // openui5 issue in github is open
                            const hasNamedModel =
                                oSelector.bindingPath.modelName && oSelector.bindingPath.modelName.length > 0
                            const isRootProperty =
                                oSelector.bindingPath.propertyPath &&
                                oSelector.bindingPath.propertyPath.charAt(0) === "/"
                            if (hasNamedModel && isRootProperty && parseFloat(sap.ui.version) < 1.81) {
                                // attach the double leading /
                                // for UI5 < 1.81
                                oSelector.bindingPath.propertyPath = `/${oSelector.bindingPath.propertyPath}`
                            }
                            if (oldAPIVersion > parseFloat(sap.ui.version)) {
                                // for version < 1.60 create the matcher
                                oSelector.bindingPath = new BindingPath(oSelector.bindingPath)
                            }
                        }

                        if (oldAPIVersion > parseFloat(sap.ui.version)) {
                            // for version < 1.60 create the matcher
                            if (oSelector.properties) {
                                oSelector.properties = new Properties(oSelector.properties)
                            }
                            if (oSelector.i18NText) {
                                oSelector.i18NText = new I18NText(oSelector.i18NText)
                            }
                            if (oSelector.labelFor) {
                                oSelector.labelFor = new LabelFor(oSelector.labelFor)
                            }
                            if (oSelector.ancestor) {
                                oSelector.ancestor = new Ancestor(oSelector.ancestor)
                            }
                        }

                        return oSelector
                    }

                    /**
                     * extract the multi use function to get a UI5 Control from a JSON Webobejct
                     */
                    window.wdi5.getUI5CtlForWebObj = (ui5Control) => {
                        return jQuery(ui5Control).control(0)
                    }

                    /**
                     * gets a UI5 controls' methods to proxy from browser- to Node.js-runtime
                     *
                     * @param {sap.<lib>.<Control>} control UI5 control
                     * @returns {String[]} UI5 control's method names
                     */
                    window.wdi5.retrieveControlMethods = (control) => {
                        // create keys of all parent prototypes
                        let properties = new Set()
                        let currentObj = control
                        do {
                            Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item))
                        } while ((currentObj = Object.getPrototypeOf(currentObj)))

                        // filter for:
                        let controlMethodsToProxy = [...properties.keys()].filter((item) => {
                            if (typeof control[item] === "function") {
                                // function

                                // filter private methods
                                if (item.startsWith("_")) {
                                    return false
                                }

                                if (item.indexOf("Render") !== -1) {
                                    return false
                                }

                                // filter not working mehtods
                                const aFilterFunctions = ["$", "getAggregation", "constructor", "getMetadata"]

                                if (aFilterFunctions.includes(item)) {
                                    return false
                                }

                                // if not already discarded -> should be in the result
                                return true
                            }
                            return false
                        })

                        return controlMethodsToProxy
                    }

                    /**
                     * replaces circular references in objects
                     * @returns function (key, value)
                     */
                    window.wdi5.circularReplacer = () => {
                        const seen = new WeakSet()
                        return (key, value) => {
                            if (typeof value === "object" && value !== null) {
                                if (seen.has(value)) {
                                    return
                                }
                                seen.add(value)
                            }
                            return value
                        }
                    }

                    /**
                     * if parameter is JS primitive type
                     * returns {boolean}
                     * @param {*} test
                     */
                    window.wdi5.isPrimitive = (test) => {
                        return test !== Object(test)
                    }

                    /**
                     * creates a array of objects containing their id as a property
                     * @param {[sap.ui.core.Control]} aControls
                     * @return {Array} Object
                     */
                    window.wdi5.createControlIdMap = (aControls) => {
                        // the array of UI5 controls need to be mapped (remove circular reference)

                        return aControls.map((element) => {
                            // just use the absolute ID of the control
                            let item = {
                                id: element.getId()
                            }
                            return item
                        })
                    }

                    /**
                     * creates an object containing their id as a property
                     * @param {sap.ui.core.Control} aControl
                     * @return {Object} Object
                     */
                    window.wdi5.createControlId = (aControl) => {
                        // the array of UI5 controls need to be mapped (remove circular reference)
                        if (!Array.isArray(aControl)) {
                            // if in aControls is a single control -> create an array first

                            // this is causes by sap.ui.base.ManagedObject -> get Aggregation defines its return value as:
                            // sap.ui.base.ManagedObject or sap.ui.base.ManagedObject[] or null

                            // aControls = [aControls]
                            let item = {
                                id: aControl.getId()
                            }
                            return item
                        } else {
                            console.error("error creating new element by id of control: " + aControl)
                        }
                    }
                }
            )
        }
    }, waitForUI5Timeout)

    if (result) {
        // set when call returns
        _isInitialized = true
        Logger.success("sucessfully initialized wdio-ui5 bridge")
    } else {
        Logger.error("bridge was not initialized correctly")
    }
    return result
}

//******************************************************************************************

/**
 * creates a string valid as object key from a selector
 * @param selector
 * @returns wdio_ui5_key
 */
function _createWdioUI5KeyFromSelector(selector: wdi5Selector): string {
    const orEmpty = (string) => string || "-"

    const _selector = selector.selector
    const wdi5_ui5_key = `${orEmpty(_selector.id)}_${orEmpty(_selector.viewName)}_${orEmpty(
        _selector.controlType
    )}_${orEmpty(JSON.stringify(_selector.bindingPath))}_${orEmpty(JSON.stringify(_selector.I18NText))}_${orEmpty(
        _selector.labelFor
    )}_${orEmpty(JSON.stringify(_selector.properties))}`.replace(/[^0-9a-zA-Z]+/, "")

    return wdi5_ui5_key
}

export async function addWdi5Commands() {
    browser.addCommand("asControl", async (wdi5Selector: wdi5Selector) => {
        const internalKey = wdi5Selector.wdio_ui5_key || _createWdioUI5KeyFromSelector(wdi5Selector)
        // either retrieve and cache a UI5 control
        // or return a cached version
        if (!browser._controls?.[internalKey] || wdi5Selector.forceSelect /* always retrieve control */) {
            Logger.info(`creating internal control with id ${internalKey}`)
            const wdi5Control = new WDI5().init(wdi5Selector, wdi5Selector.forceSelect)
            browser._controls[internalKey] = wdi5Control
        } else {
            Logger.info(`reusing internal control with id ${internalKey}`)
        }
        return browser._controls[internalKey]
    })

    /**
     * Find the best control selector for a DOM element. A selector uniquely represents a single element.
     * The 'best' selector is the one with which it is most likely to uniquely identify a control with the least possible inspection of the control tree.
     * @param {object} oOptions
     * @param {object} oOptions.domElement - DOM Element to search for
     * @param {object} oOptions.settings - ui5 settings object
     * @param {boolean} oOptions.settings.preferViewId
     */
    browser.addCommand("getSelectorForElement", async (oOptions) => {
        const result = await browser.executeAsync((oOptions, done) => {
            window.bridge
                .waitForUI5(window.wdi5.waitForUI5Options)
                .then(() => {
                    window.wdi5.Log.info("[browser wdi5] locating domElement")
                    return window.bridge.findControlSelectorByDOMElement(oOptions)
                })
                .then((controlSelector) => {
                    window.wdi5.Log.info("[browser wdi5] controlLocator created!")
                    done(["success", controlSelector])
                    return controlSelector
                })
                .catch((error) => {
                    window.wdi5.Log.error("[browser wdi5] ERR: ", error)
                    done(["error", error.toString()])
                    return error
                })
        }, oOptions)

        if (Array.isArray(result)) {
            if (result[0] === "error") {
                console.error("ERROR: getSelectorForElement() failed because of: " + result[1])
                return result[1]
            } else if (result[0] === "success") {
                console.log(`SUCCESS: getSelectorForElement() returned:  ${JSON.stringify(result[0])}`)
                return result[1]
            }
        } else {
            // Guess: was directly returned
            return result
        }
    })

    /**
     * retieve the sap.ui.version form app under test and saves to _sapUI5Version
     * returns the sap.ui.version string of the application under test
     */
    browser.addCommand("getUI5Version", async () => {
        if (!_sapUI5Version) {
            const resultVersion = await browser.executeAsync((done) => {
                done(sap.ui.version)
            })
            _sapUI5Version = resultVersion
        }

        return _sapUI5Version
    })

    /**
     * returns the sap.ui.version float number of the application under test
     */
    browser.addCommand("getUI5VersionAsFloat", async () => {
        if (!_sapUI5Version) {
            // implicit setter for _sapUI5Version
            await browser.getUI5Version()
        }

        return parseFloat(_sapUI5Version)
    })

    /**
     * uses the UI5 native waitForUI5 function to wait for all promises to be settled
     */
    browser.addCommand("waitForUI5", async () => {
        return await _waitForUI5()
    })

    /**
     * wait for ui5 and take a screenshot
     */
    browser.addCommand("screenshot", async (fileAppendix) => {
        await _waitForUI5()
        await _writeScreenshot(fileAppendix)
    })
}

/**
 * can be called to make sure before you access any eg. DOM Node the ui5 framework is done loading
 * @returns {Boolean} if the UI5 page is fully loaded and ready to interact.
 */
async function _waitForUI5() {
    if (_isInitialized) {
        // injectUI5 was already called and was successful attached
        return await _checkForUI5Ready()
    } else {
        if (await injectUI5(_config)) {
            return await _checkForUI5Ready()
        } else {
            return false
        }
    }
}

/**
 * check for UI5 via the RecordReplay.waitForUI5 method
 */
async function _checkForUI5Ready() {
    if (_isInitialized) {
        // can only be executed when RecordReplay is attached
        const result = await browser.executeAsync((done) => {
            window.bridge
                .waitForUI5(window.wdi5.waitForUI5Options)
                .then(() => {
                    window.wdi5.Log.info("[browser wdi5] UI5 is ready")
                    done(true)
                })
                .catch((error) => {
                    console.error(error)
                })
        })
        return result
    }
    return false
}

/**
 * @param fileAppendix
 */
async function _writeScreenshot(fileAppendix = "-screenshot") {
    // if config param screenshotsDisabled is set to true -> no screenshots will be taken
    if (_config.wdi5["screenshotsDisabled"]) {
        Logger.warn("screenshot skipped due to config parameter")
        return
    }

    // browser.screenshot returns the screenshot as a base64 string
    const screenshot = await browser.takeScreenshot()
    const seed = _getDateString()

    const _path = _config.wdi5.screenshotPath || tmpdir()
    const path = resolve(_path, `${seed}-${fileAppendix}.png`)

    try {
        await writeFile(path, screenshot, "base64")
        Logger.success(`screenshot at ${path} created`)
    } catch (error) {
        Logger.error(error)
    }
}

/**
 * generates date string with format M-d-hh-mm-ss
 * @returns {String}
 */
function _getDateString() {
    var x = new Date()
    return `${x.getMonth() + 1}-${x.getDate()}-${x.getHours()}-${x.getMinutes()}-${x.getSeconds()}`
}
