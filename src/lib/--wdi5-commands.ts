import { wdi5Config, wdi5Selector } from "../types/wdi5.types"
import { ControlSelector } from "sap/ui/test/RecordReplay"
import { Logger as _Logger } from "./Logger"
import { WDI5 } from "./WDI5"
const Logger = _Logger.getInstance()

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
            const wdi5Control = new WDI5().init(wdi5Selector, browser, wdi5Selector.forceSelect)
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
    _context.addCommand("waitForUI5", async () => {
        return await _waitForUI5()
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
        if (injectUI5()) {
            return await _checkForUI5Ready()
        } else {
            return false
        }
    }
}
