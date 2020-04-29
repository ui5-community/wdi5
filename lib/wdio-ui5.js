// @ts-check
const logger = require("./Logger");
const WebUI5 = require("./WebUi5")
// store the context
let _context = null;
// store the status of initialization
let _isInitialized = false;

/**
 * make sap/ui/test/RecordReplay accessible via wdio
 * attach the sap/ui/test/RecordReplay object to the application context window object as 'bridge'
 * @param {WebdriverIO.BrowserObject} context
 */
function injectUI5(context) {
    // expect boolean
    const result = context.executeAsync(done => {

        if (window.bridge) {
            // setup sap testing already done
            done(true)
        }

        if (!window.sap || !window.sap.ui) {
            // setup sap testing already cant be done due to sap namespace not present on the page
            console.error("[browser wdio-ui5] ERR: no ui5 present on page")
            done(false)
            // only condition where to cancel the seupt process
            return false;
        }

        sap.ui.require(["sap/ui/test/RecordReplay"], RecordReplay => {
            window.bridge = RecordReplay
            console.log("[browser wdio-ui5] injected!")
            window.wdi5.isInitialized = true;
            done(true)
        })

        // attach the function to be able to use the extracted method later
        if (!window.wdi5) {
            // create empty
            window.wdi5 = {
                createMatcher: null,
                isInitialized: false
            };

            // make sure the resources are required
            sap.ui.require([
                "sap/ui/test/matchers/BindingPath",
                "sap/ui/test/matchers/I18NText",
                "sap/ui/test/matchers/Properties",
                "sap/ui/test/matchers/Ancestor",
                "sap/ui/test/matchers/LabelFor",
            ], (BindingPath, I18NText, Properties, Ancestor, LabelFor) => {
                /**
                    * used to dynamically create new control matchers when searching for elements
                 */
                window.wdi5.createMatcher = (oSelector) => {

                    // Before version 1.60, the only available criteria is binding context path.
                    // As of version 1.72, it is available as a declarative matcher
                    const fVersion = 1.60;

                    if (oSelector.bindingPath) {
                        // TODO: for the binding Path there is no object creation
                        // fix (?) for "leading slash issue" in propertyPath w/ a named model
                        const hasNamedModel = oSelector.bindingPath.modelName && oSelector.bindingPath.modelName.length > 0;
                        const isRootProperty = oSelector.bindingPath.propertyPath && oSelector.bindingPath.propertyPath.charAt(0) === "/";
                        if (hasNamedModel && isRootProperty) {
                            // attach the double leading /
                            oSelector.bindingPath.propertyPath = `/${oSelector.bindingPath.propertyPath}`;
                        }
                        if (fVersion > parseFloat(sap.ui.version)) {
                            // for version < 1.60 create the matcher
                            oSelector.bindingPath = new BindingPath(oSelector.bindingPath);
                        }
                    }
                    if (oSelector.properties) {
                        if (fVersion > parseFloat(sap.ui.version)) {
                            // for version < 1.60 create the matcher
                            oSelector.properties = new Properties(oSelector.properties);
                        }
                    }
                    if (oSelector.i18NText) {
                        if (fVersion > parseFloat(sap.ui.version)) {
                            // for version < 1.60 create the matcher
                            oSelector.i18NText = new I18NText(oSelector.i18NText);
                        }
                    }
                    if (oSelector.labelFor) {
                        if (fVersion > parseFloat(sap.ui.version)) {
                            // for version < 1.60 create the matcher
                            oSelector.labelFor = new LabelFor(oSelector.labelFor);
                        }
                    }
                    if (oSelector.ancestor) {
                        if (fVersion > parseFloat(sap.ui.version)) {
                            // for version < 1.60 create the matcher
                            oSelector.ancestor = new Ancestor(oSelector.ancestor);
                        }
                    }
                    return oSelector;
                }
            });
        }
    })

    if (result) {
        // set when call returns
        _isInitialized = true;
    }
    return result;
}

/**
 * can be called to make sure before you access any eg. DOM Node the ui5 framework is done loading
 */
function waitForUI5() {
    if (_isInitialized) {
        return true;
    }
    return injectUI5(_context)
}


/**
 * internally used to execute the attach the new function calls to the wdio context object
 * https://webdriver.io/docs/customcommands.html#overwriting-native-commands
 * @param {*} context
 */
function _attachCommands(context) {
    if (!_context) {
        _context = context;
    }

    /**
     * Find the best control selector for a DOM element. A selector uniquely represents a single element.
     * The 'best' selector is the one with which it is most likely to uniquely identify a control with the least possible inspection of the control tree.
     * @param {object} oOptions
     * @param {object} oOptions.domElement - DOM Element to search for
     * @param {object} oOptions.settings - ui5 settings object
     * @param {boolean} oOptions.settings.preferViewId
     * @param {WebdriverIO.BrowserObject} context
     */
    context.addCommand("getSelectorForElement", oOptions => {
        const result = context.executeAsync((oOptions, done) => {

            return window.bridge
                .waitForUI5()
                .then(() => {
                    console.log("[browser wdio-ui5] locating domElement");
                    return window.bridge.findControlSelectorByDOMElement(oOptions)
                })
                .then(controlSelector => {
                    console.log("[browser wdio-ui5] controlLocator created!")
                    done(["success", controlSelector])
                    return controlSelector
                })
                .catch(error => {
                    console.error("[browser wdio-ui5] ERR: ", error)
                    done(["error", error.toString()])
                    return error;
                })
        }, oOptions)

        if (Array.isArray(result)) {
            if (result[0] === 'error') {
                logger.error("[node wdio-ui5] ERR: getSelectorForElement() failed because of: " + result[1])
                return result[1];
            } else if (result[0] === 'success') {
                logger.log(`[node wdio-ui5] getSelectorForElement() ${JSON.stringify(result[0])}`)
                return result[1];
            }
        } else {
            // Guess: was directly returned
            return result;
        }
    })


    context.addCommand("asControl", (wdi5Selector) => {
        // facade on a UI5 control
        // to expose certain methods of the UI5 control via wdio

        if (!wdi5Selector.wdio_ui5_key) {
            throw new Error("[node wdio-ui5] ERR: please provide the internal key 'wdio_ui5_key' for the selector")
        }

        // create an internal store of already retrieved UI5 elements
        // in the form of their wdio counterparts
        // for faster subsequent access
        if (!context._controls) {
            logger.info("[node wdio-ui5] creating internal control map")
            context._controls = {}
        }
        const internalKey = wdi5Selector.wdio_ui5_key
        if (!context._controls[internalKey]) {

            // is done webui5 internally
            // const ui5control = context.getControl(controlSelector)

            // create webui5 control
            const webUi5Control = new WebUI5(wdi5Selector, context);

            // save control
            context._controls[internalKey] = webUi5Control
            logger.info(`[node wdio-ui5] creating internal control with id ${internalKey}`)

            return webUi5Control
        } else {
            logger.info(`[node wdio-ui5] reusing internal control with id ${internalKey}`)
            // return webui5 control from storage map
            return context._controls[internalKey]
        }

    });
}

/**
 * use wdio's hooks for setting up custom commands in the context
 * @param {WebdriverIO.BrowserObject} context
 */
function setup(context) {
    _attachCommands(context);
}

module.exports = {
    injectUI5,
    setup,
    waitForUI5
}
