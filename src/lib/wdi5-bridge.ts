import type {
    clientSide_ui5Object,
    clientSide_ui5Response,
    wdi5Config,
    wdi5Selector,
    BTPAuthenticator as BTPAuthenticatorType,
    wdi5Authenticator
} from "../types/wdi5.types.js"

import { resolve } from "node:path"
import { writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import * as semver from "semver"
import { mark as marky_mark, stop as marky_stop } from "marky"

import { WDI5Control } from "./wdi5-control.js"
import { WDI5FE } from "./wdi5-fe.js"
import { clientSide_injectTools } from "../../client-side-js/injectTools.cjs"
import { clientSide_injectUI5 } from "../../client-side-js/injectUI5.cjs"
import { clientSide_injectXHRPatch } from "../../client-side-js/injectXHRPatch.cjs"
import { clientSide_getSelectorForElement } from "../../client-side-js/getSelectorForElement.cjs"
import { clientSide_checkForUI5Ready } from "../../client-side-js/_checkForUI5Ready.cjs"
import { clientSide_getObject } from "../../client-side-js/getObject.cjs"
import { clientSide_getUI5Version } from "../../client-side-js/getUI5Version.cjs"
import { clientSide__navTo } from "../../client-side-js/_navTo.cjs"
import { clientSide_allControls } from "../../client-side-js/allControls.cjs"
import { Logger as _Logger } from "./Logger.js"
import { WDI5Object } from "./wdi5-object.js"
import BTPAuthenticator from "./authentication/BTPAuthenticator.js"
import BasicAuthenticator from "./authentication/BasicAuthenticator.js"
import CustomAuthenticator from "./authentication/CustomAuthenticator.js"
import Office365Authenticator from "./authentication/Office365Authenticator.js"

const Logger = _Logger.getInstance()

/** store the status of initialization */
let _isInitialized = false

/** stores the status of the setup process */
let _setupComplete = false
/** currently running sap.ui.version */
let _sapUI5Version: string
/** relay runtime config options from Service */
let _config: wdi5Config

export async function setup(config: wdi5Config, browserInstance: WebdriverIO.Browser) {
    _config = config
    if (_setupComplete) {
        // already setup done
        return
    }
    // jump-start the desired log level
    Logger.setLogLevel(config?.wdi5?.logLevel || "error")

    if (browserInstance.isMultiremote) {
        ;(browserInstance as unknown as WebdriverIO.MultiRemoteBrowser).instances.forEach((name) => {
            initBrowser(browserInstance[name as keyof typeof browserInstance])
        })
        initMultiRemoteBrowser(browserInstance)
    } else {
        initBrowser(browserInstance)
    }

    _setupComplete = true
}

export async function start(config: wdi5Config, browserInstance: WebdriverIO.Browser) {
    // TODO: what if config.wdi5 and config.baseUrl are not set?
    if (config?.wdi5?.url) {
        // still support the old logic that we don't have breaking changes
        Logger.warn(`'url' property in config file deprecated: please use 'baseUrl' only!`)
        Logger.info(`open url: ${config.wdi5.url}`)
        await browserInstance.url(config.wdi5.url)
    } else {
        Logger.info(`open url: ${config.baseUrl}`)
        await browserInstance.url(config.baseUrl)
    }
}

function initMultiRemoteBrowser(browserInstance: WebdriverIO.Browser) {
    ;["asControl", "goTo", "screenshot", "waitForUI5", "getUI5Version", "getSelectorForElement", "allControls"].forEach(
        (command) => {
            browserInstance.addCommand(command, async (...args) => {
                const multiRemoteInstance = browser as unknown as WebdriverIO.MultiRemoteBrowser
                const result = []
                multiRemoteInstance.instances.forEach((name) => {
                    result.push(multiRemoteInstance[name][command].apply(this, args))
                })
                return Promise.all(result)
            })
        }
    )
}

function initBrowser(browserInstance: WebdriverIO.Browser) {
    // init control cache
    if (!browserInstance._controls) {
        Logger.info("creating internal control map")
        browserInstance._controls = []
    }

    _addWdi5Commands(browserInstance)

    if (!(browserInstance as any).fe) {
        ;(browserInstance as any).fe = WDI5FE
    }

    _setupComplete = true
}

function checkUI5Version(ui5Version: string) {
    if (semver.lt(ui5Version, "1.60.0")) {
        // the record replay api is only available since 1.60
        Logger.error("The UI5 version of your application is too low. Minimum required is 1.60!")
        throw new Error("The UI5 version of your application is too low. Minimum required is 1.60!")
    }
}

/**
 * function library to setup the webdriver to UI5 bridge, it runs all the initial setup
 * make sap/ui/test/RecordReplay accessible via wdio
 * attach the sap/ui/test/RecordReplay object to the application context window object as 'bridge'
 */
export async function injectUI5(config: wdi5Config, browserInstance: WebdriverIO.Browser) {
    if (!config?.wdi5) {
        //Fetching config from global variable
        config.wdi5 = global.__wdi5Config.wdi5
    }
    const waitForUI5Timeout = config?.wdi5?.waitForUI5Timeout || 15000
    let result = true

    // unify timeouts across Node.js- and browser-scope
    // align browser script timeout with wdi5 setting (+ leverage)
    // this mostly affects browser.execute()
    const timeout = waitForUI5Timeout + 1000
    await browserInstance.setTimeout({ script: timeout })

    Logger.debug(`browser script timeout set to ${timeout}`)
    if (typeof browserInstance.getTimeouts === "function") {
        Logger.debug(`browser timeouts are ${JSON.stringify(await browserInstance.getTimeouts(), null, 2)}`)
    }

    const version = await browserInstance.getUI5Version()
    checkUI5Version(version)
    await clientSide_injectTools(browserInstance) // helpers for wdi5 browser scope
    // BIDI does not allow to pass functions inside of the browser scope
    await clientSide_injectXHRPatch(config.wdi5, browserInstance)
    result = result && (await clientSide_injectUI5(waitForUI5Timeout, browserInstance))

    // we are not using _controls as an array, we are using it as an object. That's why the length property
    // is not updated right away: https://stackoverflow.com/a/4424026
    if (Object.keys(browserInstance._controls).length > 0) {
        Logger.info("invalidating control map!")
        browserInstance._controls = []
    }

    if (result) {
        // set when call returns
        _isInitialized = true
        Logger.success("successfully initialized wdio-ui5 bridge")
    } else {
        Logger.error("bridge was not initialized correctly")
    }
    return result
}

export async function checkForUI5Page(browserInstance: WebdriverIO.Browser) {
    // wait till the loading finished and the state is "completed"
    await browserInstance.waitUntil(async () => {
        const checkState = await browserInstance.execute(() => {
            return { state: document.readyState, sapReady: !!window.sap }
        })
        return checkState.state === "complete" && checkState.sapReady
    })
    // sap in global window namespace denotes (most likely :) ) that ui5 is present
    return await browserInstance.execute(() => {
        return !!window.sap
    })
}

export async function authenticate(options: wdi5Authenticator, browserInstanceName: string) {
    switch (options.provider) {
        case "BTP": {
            const btp = new BTPAuthenticator(options, browserInstanceName)
            if ((options as BTPAuthenticatorType).disableBiometricAuthentication) {
                await btp.disableBiometricAuthentication()
            }
            await btp.login()
            break
        }
        case "BasicAuth":
            await new BasicAuthenticator(options, browserInstanceName, _config.baseUrl).login()
            break
        case "Office365":
            await new Office365Authenticator(options, browserInstanceName).login()
            break
        case "custom":
            await new CustomAuthenticator(options, browserInstanceName).login()
            break
        default:
            break
    }
}

//******************************************************************************************
// private

/**
 * creates a string valid as object key from a selector
 * @param selector
 * @returns wdio_ui5_key
 */
function _createWdioUI5KeyFromSelector(selector: wdi5Selector): string {
    const orEmpty = (string) => string || ""

    const _selector = selector.selector
    const wdi5_ui5_key = `${orEmpty(_selector.id)}${orEmpty(_selector.viewName)}${orEmpty(
        _selector.controlType
    )}${orEmpty(JSON.stringify(_selector.bindingPath))}${orEmpty(JSON.stringify(_selector.i18NText))}${orEmpty(
        JSON.stringify(_selector.descendant)
    )}${orEmpty(JSON.stringify(_selector.labelFor))}${orEmpty(JSON.stringify(_selector.properties))}${orEmpty(
        JSON.stringify(_selector.ancestor)
    )}`.replace(/[^0-9a-zA-Z]+/, "")

    return wdi5_ui5_key
}
/**
 * does a basic validation of a wdi5ControlSelector
 * @param wdi5Selector: wdi5Selector
 * @returns {boolean} if the given selector is a valid selector
 */
function _verifySelector(wdi5Selector: wdi5Selector) {
    /* eslint-disable no-prototype-builtins */
    if (wdi5Selector.hasOwnProperty("selector")) {
        if (
            wdi5Selector.selector.hasOwnProperty("id") ||
            wdi5Selector.selector.hasOwnProperty("viewName") ||
            wdi5Selector.selector.hasOwnProperty("bindingPath") ||
            wdi5Selector.selector.hasOwnProperty("controlType") ||
            wdi5Selector.selector.hasOwnProperty("i18NText") ||
            wdi5Selector.selector.hasOwnProperty("labelFor") ||
            wdi5Selector.selector.hasOwnProperty("descendant") ||
            wdi5Selector.selector.hasOwnProperty("ancestor") ||
            wdi5Selector.selector.hasOwnProperty("properties") ||
            wdi5Selector.selector.hasOwnProperty("sibling") ||
            wdi5Selector.selector.hasOwnProperty("interactable")
            /* eslint-enable no-prototype-builtins */
        ) {
            return true
        }
        Logger.error(
            "Specified selector is not valid. Please use at least one of: 'id, viewName, bindingPath, controlType, i18NText, labelFor, ancestor, properties, descendant, sibling, interactable' -> abort"
        )
        return false
    }
    Logger.error("Specified selector is not valid -> property 'selector' is missing")
    return false
}

export async function _addWdi5Commands(browserInstance: WebdriverIO.Browser) {
    browserInstance.addCommand("_asControl", async (wdi5Selector: wdi5Selector) => {
        if (!_verifySelector(wdi5Selector)) {
            return "ERROR: Specified selector is not valid -> abort"
        }

        const internalKey = wdi5Selector.wdio_ui5_key || _createWdioUI5KeyFromSelector(wdi5Selector)
        // either retrieve and cache a UI5 control
        // or return a cached version
        if (!browserInstance._controls?.[internalKey] || wdi5Selector.forceSelect /* always retrieve control */) {
            Logger.info(`creating internal control with id ${internalKey}`)
            wdi5Selector.wdio_ui5_key = internalKey

            marky_mark("retrieveSingleControl") //> TODO: bind to debug log level

            const wdi5Control = await new WDI5Control({ browserInstance }).init(wdi5Selector, wdi5Selector.forceSelect)

            const e = marky_stop("retrieveSingleControl") //> TODO: bind to debug log level
            Logger.info(`_asControl() needed ${e.duration} for ${internalKey}`)

            browserInstance._controls[internalKey] = wdi5Control
        } else {
            Logger.info(`reusing internal control with id ${internalKey}`)
        }
        return browserInstance._controls[internalKey]
    })

    browserInstance.addCommand("asObject", async (_uuid: string) => {
        const _result = (await clientSide_getObject(_uuid)) as clientSide_ui5Object
        const { uuid, status, aProtoFunctions, className, object } = _result
        if (status === 0) {
            // create new wdi5-Object
            const wdiObject = new WDI5Object(uuid, aProtoFunctions, object)
            return wdiObject
        }
        _writeObjectResultLog(_result, "asObject()")

        return { status: status, aProtoFunctions: aProtoFunctions, className: className, uuid: uuid }
    })

    // no fluent API -> no private method
    browserInstance.addCommand("allControls", async (wdi5Selector: wdi5Selector) => {
        if (!_verifySelector(wdi5Selector)) {
            return "ERROR: Specified selector is not valid -> abort"
        }

        const internalKey = wdi5Selector.wdio_ui5_key || _createWdioUI5KeyFromSelector(wdi5Selector)
        // REVISIT all elements receive the same! internal key
        if (!browserInstance._controls?.[internalKey] || wdi5Selector.forceSelect /* always retrieve control */) {
            wdi5Selector.wdio_ui5_key = internalKey
            Logger.info(`creating internal controls with id ${internalKey}`)
            browserInstance._controls[internalKey] = await _allControls(wdi5Selector, browserInstance)
            return browserInstance._controls[internalKey]
        } else {
            Logger.info(`reusing internal control with id ${internalKey}`)
        }
        return browserInstance._controls[internalKey]
    })

    /**
     * Find the best control selector for a DOM element. A selector uniquely represents a single element.
     * The 'best' selector is the one with which it is most likely to uniquely identify a control with the least possible inspection of the control tree.
     * @param {object} oOptions
     * @param {object} oOptions.domElement - DOM Element to search for
     * @param {object} oOptions.settings - ui5 settings object
     * @param {boolean} oOptions.settings.preferViewId
     */
    browserInstance.addCommand("getSelectorForElement", async (oOptions) => {
        const result = (await clientSide_getSelectorForElement(oOptions, browserInstance)) as clientSide_ui5Response

        if (result.status === 1) {
            console.error("ERROR: getSelectorForElement() failed because of: " + result.message)
            return result.message
        } else if (result.status === 0) {
            console.log(`SUCCESS: getSelectorForElement() returned:  ${JSON.stringify(result.result)}`)
            return result.result
        }
    })

    browserInstance.addCommand("getUI5Version", async () => {
        if (!_sapUI5Version) {
            const resultVersion = await clientSide_getUI5Version(browserInstance)
            _sapUI5Version = resultVersion
        }

        return _sapUI5Version
    })

    /**
     * uses the UI5 native waitForUI5 function to wait for all promises to be settled
     */
    browserInstance.addCommand("waitForUI5", async () => {
        return await _waitForUI5(browserInstance)
    })

    /**
     * wait for ui5 and take a screenshot
     */
    browserInstance.addCommand("screenshot", async (fileAppendix) => {
        await _waitForUI5(browserInstance)
        await _writeScreenshot(browserInstance, fileAppendix)
    })

    browserInstance.addCommand("goTo", async (oOptions) => {
        // allow for method sig to be both
        //  wdi5()...goTo("#/accounts/create")
        //  wdi5()...goTo({sHash:"#/accounts/create"})
        let sHash
        if (typeof oOptions === "string") {
            sHash = oOptions
        } else {
            sHash = oOptions.sHash
        }
        const oRoute = oOptions.oRoute

        if (sHash && sHash.length > 0) {
            // we need to still support the old url property
            // TODO: use type wdi5Config not any
            if ((browserInstance.options as wdi5Config)?.wdi5?.url) {
                const url = (browserInstance.options as any).wdi5["url"] || (await browserInstance.getUrl())

                // navigate via hash if defined
                if (url && url.length > 0 && url !== "#") {
                    // prefix url config if is not just a hash (#)
                    const currentUrl = await browserInstance.getUrl()
                    const alreadyNavByHash = currentUrl.includes("#")
                    const navToRoot = url.startsWith("/")
                    if (alreadyNavByHash && !navToRoot) {
                        await browserInstance.url(`${currentUrl.split("#")[0]}${sHash}`)
                    } else {
                        await browserInstance.url(`${url}${sHash}`)
                    }
                } else if (url && url.length > 0 && url === "#") {
                    // route without the double hash
                    await browserInstance.url(`${sHash}`)
                } else {
                    // just a fallback
                    await browserInstance.url(`${sHash}`)
                }
            } else {
                await browserInstance.url(sHash)
            }
        } else if (oRoute && oRoute.sName) {
            // navigate using the ui5 router
            // sComponentId, sName, oParameters, oComponentTargetInfo, bReplace
            await _navTo(
                oRoute.sComponentId,
                oRoute.sName,
                oRoute.oParameters,
                oRoute.oComponentTargetInfo,
                oRoute.bReplace,
                browserInstance
            )
        } else {
            Logger.error("ERROR: navigating to another page")
        }
    })

    // inspired by and after staring a long time hard at:
    // https://stackoverflow.com/questions/51635378/keep-object-chainable-using-async-methods
    // https://github.com/Shigma/prochain
    // https://github.com/l8js/l8/blob/main/src/core/liquify.js

    // channel the async function browser._asControl (init'ed via browser.addCommand above) through a Proxy
    // in order to chain calls of any subsequent UI5 api methods on the retrieved UI5 control:
    // await browser.asControl(selector).methodOfUI5control().anotherMethodOfUI5control()
    // the way this works is twofold:
    // 1. (almost) all UI5 $control's API methods are reinjected from the browser-scope
    //    into the Node.js scope via async wdi5._executeControlMethod(), which in term actually calls
    //    the reinjected API method within the browser scope
    // 2. the execution of each UI5 $control's API method (via async wdi5._executeControlMethod() => Promise) is then chained
    //    via the below "then"-ing of the (async wdi5._executeControlMethod() => Promise)-Promises with the help of
    //    the a Proxy and a recursive `handler` function
    if (!browserInstance.asControl) {
        browserInstance.asControl = function (ui5ControlSelector) {
            const asyncMethods = ["then", "catch", "finally"]
            const functionQueue = []
            // we need to do the same operation as in the 'init' of 'wdi5-control.ts'
            const logging = ui5ControlSelector?.logging ?? true
            function makeFluent(target) {
                const promise = Promise.resolve(target)
                const handler = {
                    get(_, prop) {
                        functionQueue.push(prop)
                        return asyncMethods.includes(prop)
                            ? (...boundArgs) => makeFluent(promise[prop](...boundArgs))
                            : makeFluent(
                                  promise.then((object) => {
                                      // when object is undefined the previous function call failed
                                      try {
                                          return object[prop]
                                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                      } catch (error) {
                                          // different node versions return a different `error.message` so we use our own message
                                          if (logging) {
                                              Logger.error(`Cannot read property '${prop}' in the execution queue!`)
                                          }
                                      }
                                  })
                              )
                    },
                    apply(_, thisArg, boundArgs) {
                        return makeFluent(
                            // When "targetFunction" is empty we can assume that there are errors in the execution queue
                            promise.then((targetFunction) => {
                                if (targetFunction) {
                                    return Reflect.apply(targetFunction, thisArg, boundArgs)
                                } else {
                                    // a functionQueue without a 'then' can be ignored
                                    // as the original error was already logged
                                    if (functionQueue.includes("then") && logging) {
                                        functionQueue.splice(functionQueue.indexOf("then"))
                                        Logger.error(
                                            `One of the calls in the queue "${functionQueue.join(
                                                "()."
                                            )}()" previously failed!`
                                        )
                                    }
                                }
                            })
                        )
                    }
                }

                return new Proxy(function () {}, handler)
            }
            // @ts-expect-error TODO: fix types
            return makeFluent(browserInstance._asControl(ui5ControlSelector))
        }
    }
}

/**
 * retrieve a DOM element via UI5 locator
 * @param {sap.ui.test.RecordReplay.ControlSelector} controlSelector
 * @return {[WebdriverIO.Element | String, [aProtoFunctions]]} UI5 control or error message, array of function names of this control
 */
async function _allControls(controlSelector = this._controlSelector, browserInstance = browser) {
    // check whether we have a "by id regex" locator request
    if (controlSelector.selector.id && typeof controlSelector.selector.id === "object") {
        // make it a string for serializing into browser-scope and
        // further processing there
        controlSelector.selector.id = controlSelector.selector.id.toString()
    }

    if (
        typeof controlSelector.selector.properties?.text === "object" &&
        controlSelector.selector.properties?.text instanceof RegExp
    ) {
        // make it a string for serializing into browser-scope and
        // further processing there
        controlSelector.selector.properties.text = controlSelector.selector.properties.text.toString()
    }

    // pre retrive control information
    const response = await clientSide_allControls(controlSelector, browserInstance)
    _writeObjectResultLog(response, "allControls()")

    if (response.status === 0) {
        const retrievedElements = response.result
        const resultWDi5Elements = []

        // domElement: domElement, id: id, aProtoFunctions
        for await (const cControl of retrievedElements) {
            const oOptions = {
                controlSelector: controlSelector,
                wdio_ui5_key: controlSelector.wdio_ui5_key,
                forceSelect: controlSelector.forceSelect,
                generatedUI5Methods: cControl.aProtoFunctions,
                webdriverRepresentation: null,
                webElement: cControl.domElement,
                domId: cControl.id,
                browserInstance
            }

            // FIXME: multi remote support by providing browserInstance in constructor
            resultWDi5Elements.push(new WDI5Control(oOptions))
        }

        return resultWDi5Elements
    } else {
        return "[wdi5] Error: fetch multiple elements failed: " + response.message
    }
}

/**
 * can be called to make sure before you access any eg. DOM Node the ui5 framework is done loading
 * @returns {Boolean} if the UI5 page is fully loaded and ready to interact.
 */
async function _waitForUI5(browserInstance: WebdriverIO.Browser) {
    if (_isInitialized) {
        // injectUI5 was already called and was successful attached
        return await _checkForUI5Ready(browserInstance)
    } else {
        if (await injectUI5(_config, browserInstance)) {
            return await _checkForUI5Ready(browserInstance)
        } else {
            return false
        }
    }
}

/**
 * check for UI5 via the RecordReplay.waitForUI5 method
 */
async function _checkForUI5Ready(browserInstance: WebdriverIO.Browser) {
    const ready = false
    if (_isInitialized) {
        // can only be executed when RecordReplay is attached
        return await clientSide_checkForUI5Ready(browserInstance)
    }
    return ready
}

/**
 * @param fileAppendix
 */
async function _writeScreenshot(browserInstance: WebdriverIO.Browser, fileAppendix = "-screenshot") {
    // if config param screenshotsDisabled is set to true -> no screenshots will be taken
    if (!_config?.wdi5 || _config.wdi5["screenshotsDisabled"]) {
        Logger.warn("screenshot skipped due to config parameter")
        return
    }

    // browserInstance.screenshot returns the screenshot as a base64 string
    const screenshot = await browserInstance.takeScreenshot()
    const seed = _getDateString()

    const _path = _config.wdi5.screenshotPath || tmpdir()
    const path = resolve(_path, `${seed}-${fileAppendix}.png`)

    try {
        await writeFile(path, screenshot, "base64")
        Logger.success(`screenshot at ${path} created`)
    } catch (error) {
        Logger.error(`error while saving screenshot: ${error}`)
    }
}

/**
 * generates date string with format M-d-hh-mm-ss
 * @returns {String}
 */
function _getDateString() {
    const x = new Date()
    return `${x.getMonth() + 1}-${x.getDate()}-${x.getHours()}-${x.getMinutes()}-${x.getSeconds()}`
}

/**
 * navigates to a UI5 route using the Component router
 * @param {String} sComponentId
 * @param {String} sName
 * @param {Object} oParameters
 * @param {Object} oComponentTargetInfo
 * @param {Boolean} bReplace
 */
async function _navTo(
    sComponentId,
    sName,
    oParameters,
    oComponentTargetInfo,
    bReplace,
    browserInstance: WebdriverIO.Browser
) {
    const result = (await clientSide__navTo(
        sComponentId,
        sName,
        oParameters,
        oComponentTargetInfo,
        bReplace,
        browserInstance
    )) as clientSide_ui5Response
    if (result.status === 1) {
        Logger.error("ERROR: navigation using UI5 router failed because of: " + result.message)
        return result.result
    } else if (result.status === 0) {
        Logger.info(`SUCCESS: navigation using UI5 router to hash: ${JSON.stringify(result.status)}`)
        return result.result
    }
}

/**
 * create log based on the status of result.status
 * @param {Array} result
 * @param {*} functionName
 */
function _writeObjectResultLog(response: clientSide_ui5Response, functionName: string) {
    if (response.status > 0) {
        Logger.error(`call of ${functionName} failed because of: ${response.message}`)
    } else if (response.status === 0) {
        Logger.success(
            `call of function ${functionName} returned: ${JSON.stringify(response.id ? response.id : response.result)}`
        )
    } else {
        Logger.warn(`Unknown status: ${functionName} returned: ${JSON.stringify(response.message)}`)
    }
}
