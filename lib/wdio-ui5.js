// @ts-check
const logger = require("./Logger");
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
    _isInitialized = true;
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
 * Interact with specific control.
 * @param {object} oOptions
 * @param {sap.ui.test.RecordReplay.ControlSelector} oOptions.selector - UI5 type
 * @param {sap.ui.test.RecordReplay.InteractionType} oOptions.interactionType - UI5 type
 * @param {string} oOptions.enterText
 * @param {boolean} oOptions.clearTextFirst
 * @param {object} context
 */
function _interactWithControl(oOptions, context) {
    const result = context.executeAsync((oOptions, done) => {

        return window.bridge
            .waitForUI5()
            .then(() => {
                console.log("[browser wdio-ui5] locating controlSelector");
                oOptions.selector = window.wdi5.createMatcher(oOptions.selector)
                return window.bridge.interactWithControl(oOptions)
            })
            .then(result => {
                console.log("[browser wdio-ui5] interaction complete! - Message: " + result)
                done(["success", result])
                return result
            })
            .catch(error => {
                console.error("[browser wdio-ui5] ERR: ", error)
                done(["error", error.toString()])
                return error;
            })

    }, oOptions)
    return result
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
function _getSelectorForElement(oOptions, context) {
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
    return result
}

/**
 * retrieve a DOM element via UI5 locator
 * @param {sap.ui.test.RecordReplay.ControlSelector} control
 * @param {WebdriverIO.BrowserObject} context
 */
function getControl(control, context) {
    const result = context.executeAsync((control, done) => {

        return window.bridge
            .waitForUI5()
            .then(() => {
                console.log("[browser wdio-ui5] locating " + JSON.stringify(control))
                control.selector = window.wdi5.createMatcher(control.selector);
                debugger;
                return window.bridge.findDOMElementByControlSelector(control)
            })
            .then(domElement => {
                console.log("[browser wdio-ui5] control located! - Message: " + JSON.stringify(domElement))
                // TODO: improve error logging -> https://github.com/webdriverio/webdriverio/issues/999
                done(["success", domElement])
                return domElement
            })
            .catch(error => {
                console.error("[browser wdio-ui5] ERR: ", error)
                done(["error", error.toString()])
                throw new Error("[node wdio-ui5] ERR: getControl() failed because of: " + error.toString())
            })
    }, control)
    return result
}

/**
 * get the property value of a UI5 control
 * @param {WebdriverIO.Element} selector
 * @param {String} propertyName
 * @param {WebdriverIO.BrowserObject} context
 */
function getProperty(selector, propertyName, context) {
    const result = context.executeAsync(
        (selector, propertyName, done) => {
            return window.bridge.waitForUI5().then(() => {
                // DOM to ui5
                let oControl = jQuery(selector).control(0)
                let sProperty = ""
                switch (propertyName) {
                    case "id":
                        sProperty = oControl.getId()
                        break

                    default:
                        sProperty = oControl.getProperty(propertyName)
                        break
                }
                done(sProperty)
            })
        },
        selector,
        propertyName
    )

    return result
}

/**
 * create an internal store of already retrieved UI5 elements
 * in the form of their wdio counterparts
 * for faster subsequent access
 * @param {*} context
 * @param {*} control
 */
function addControlToIntStore(context, control) {

    if (context && !context._controls) {
        logger.info("[node wdio-ui5] creating internal control map")
        context._controls = {}
    }

    const internalKey = control.wdio_ui5_key
    if (context && !context._controls[internalKey]) {
        context._controls[internalKey] = context.getControl(control)
        logger.info(`[node wdio-ui5] creating internal control with id ${internalKey}`)
    } else {
        logger.info(`[node wdio-ui5] reusing internal control with id ${internalKey}`)
    }

    return
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

    // regular wdio hook -> get the property of a ui5 control
    // only used internally via .asControl() facade
    context.addCommand("_getProperty", async (ui5control, property) => {
        const ui5controlProperty = await getProperty(ui5control, property, context)
        logger.info(`[node wdio-ui5] retrieved property ${property} of wdio-internal element ${JSON.stringify(ui5control)}`)
        return ui5controlProperty
    })

    // regular wdio hook -> locate a ui5 control
    context.addCommand("getControl", selector => {

        // TODO: return directly if control is already in map

        let result = getControl(selector, context)

        if (Array.isArray(result)) {
            if (result[0] === 'error') {
                logger.error("[node wdio-ui5] ERR: getControl() failed because of: " + result[1])
                return result[1];
            } else if (result[0] === 'success') {
                logger.log(`[node wdio-ui5] getControl() ${JSON.stringify(result[1])}`)

                // addControlToIntStore(_context, result[1]);
                return result[1];
            }
        } else {
            // Guess: was directly returned
            // addControlToIntStore(_context, result);
            return result;
        }
    })

    context.addCommand("interactWithControl", oOptions => {
        let result = _interactWithControl(oOptions, context)

        if (Array.isArray(result)) {
            if (result[0] === 'error') {
                logger.error("[node wdio-ui5] ERR: interactWithControl() failed because of: " + result[1])
                return result[1];
            } else if (result[0] === 'success') {
                logger.log(`[node wdio-ui5] interactWithControl() ${JSON.stringify(result[0])}`)
                return result[1];
            }
        } else {
            // Guess: was directly returned
            return result;
        }
    })

    context.addCommand("getSelectorForElement", oOptions => {
        let result = _getSelectorForElement(oOptions, context)

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

    context.addCommand("isFocusedDeep", function () {
        const result = context.executeAsync((elem, done) => {
            return window.bridge.waitForUI5().then(() => {
                let activeElement = document.activeElement;

                while (activeElement.shadowRoot) {
                    if (activeElement.shadowRoot.activeElement) {
                        activeElement = activeElement.shadowRoot.activeElement;
                    } else {
                        break;
                    }
                }
                done(elem === activeElement);
                return elem === activeElement;
            });
        }, this);
        return result
    }, true);

    context.addCommand("setProperty", function (property, value) {
        return context.executeAsync((elem, property, value, done) => {
            return window.bridge.waitForUI5().then(() => {
                done(elem[property] = value)
                return elem[property] = value;
            });
        }, this, property, value);
    }, true);

    context.addCommand("setAttribute", function (attribute, value) {
        return context.executeAsync((elem, attribute, value, done) => {
            return window.bridge.waitForUI5().then(() => {
                done(elem.setAttribute(attribute, value))
                return elem.setAttribute(attribute, value);
            });
        }, this, attribute, value);
    }, true);

    context.addCommand("removeAttribute", function (attribute) {
        return context.executeAsync((elem, attribute, done) => {
            return window.bridge.waitForUI5().then(() => {
                done(elem.removeAttribute(attribute))
                return elem.removeAttribute(attribute);
            });
        }, this, attribute);
    }, true);

    context.addCommand("hasClass", function (className) {
        return context.executeAsync((elem, className, done) => {
            return window.bridge.waitForUI5().then(() => {
                done(elem.classList.contains(className))
                return elem.classList.contains(className);
            });
        }, this, className);
    }, true);

    context.addCommand("asControl", function (control) {
        // facade on a UI5 control
        // to expose certain methods of the UI5 control via wdio

        if (!control.wdio_ui5_key) {
            throw new Error("[node wdio-ui5] ERR: please provide the internal key 'wdio_ui5_key' for the selector")
        }

        // TODO: addControlToIntStore(context, control);

        // create an internal store of already retrieved UI5 elements
        // in the form of their wdio counterparts
        // for faster subsequent access
        if (!context._controls) {
            logger.info("[node wdio-ui5] creating internal control map")
            context._controls = {}
        }
        const internalKey = control.wdio_ui5_key
        if (!context._controls[internalKey]) {
            const ui5control = context.getControl(control)
            context._controls[internalKey] = ui5control
            logger.info(`[node wdio-ui5] creating internal control with id ${internalKey}`)
        } else {
            logger.info(`[node wdio-ui5] reusing internal control with id ${internalKey}`)
        }

        // expose $context.as Control($ui5-selector)
        //  .getProperty (._getControl is intended for internal use only)
        return {
            _control: control,
            _getControl(control) {
                return context._controls[control.wdio_ui5_key]
            },
            getProperty(name) {
                const ui5control = this._getControl(control)
                const property = context._getProperty(ui5control, name)
                return property
            }
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
