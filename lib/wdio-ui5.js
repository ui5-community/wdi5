// @ts-check

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
                "sap/ui/test/actions/Press",
                "sap/ui/test/matchers/BindingPath",
                "sap/ui/test/matchers/I18NText",
                "sap/ui/test/matchers/Properties",
                "sap/ui/test/matchers/Ancestor"
            ]);

            /**
             * used to dynamically called to create new selectors when searching for elements
             */
            window.wdi5.createMatcher = (oSelector) => {
                if (oSelector.bindingPath) {
                    oSelector.bindingPath = new sap.ui.test.matchers.BindingPath(oSelector.bindingPath);
                }
                if (oSelector.properties) {
                    oSelector.properties = new sap.ui.test.matchers.Properties(oSelector.properties);
                }
                if (oSelector.i18NText) {
                    oSelector.i18NText = new sap.ui.test.matchers.I18NText(oSelector.i18NText);
                }
                return oSelector;
            }

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

                const result = window.bridge.interactWithControl(oOptions)
                done(["success", result])
                return result
            })
            .catch(error => {
                console.error("[browser wdio-ui5] ERR: ", error)
                done(["error", error.toString()])
                return error;
            })

    }, oOptions)

    console.log(`[node wdio-ui5] _interactWithControl ${JSON.stringify(result)}`)
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
    console.log(`[node wdio-ui5] _getSelectorForElement ${JSON.stringify(result)}`)
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

                return window.bridge.findDOMElementByControlSelector(control)
            })
            .then(domElement => {
                console.log("[browser wdio-ui5] control located! - Message:" + JSON.stringify(domElement))
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
    console.log(`[node wdio-ui5] getControl ${JSON.stringify(result)}`)
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
        console.info(`[node wdio-ui5] retrieved property ${property} of wdio-internal element ${JSON.stringify(ui5control)}`)
        return ui5controlProperty
    })

    // regular wdio hook -> locate a ui5 control
    context.addCommand("getControl", selector => {
        let result = getControl(selector, context)

        if (Array.isArray(result)) {
            if (result[0] === 'error') {
                console.error("[node wdio-ui5] ERR: getControl() failed because of: " + result[1])
                return {};
            } else if (result[0] === 'success') {
                return result[1];
            }
        } else {
            // Guess: was directly returned
            return result;
        }
    })

    context.addCommand("interactWithControl", oOptions => {
        let result = _interactWithControl(oOptions, context)

        if (Array.isArray(result)) {
            if (result[0] === 'error') {
                console.error("[node wdio-ui5] ERR: interactWithControl() failed because of: " + result[1])
                return {};
            } else if (result[0] === 'success') {
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
                console.error("[node wdio-ui5] ERR: getSelectorForElement() failed because of: " + result[1])
                return {};
            } else if (result[0] === 'success') {
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

        // create an internal store of already retrieved UI5 elements
        // in the form of their wdio counterparts
        // for faster subsequent access
        if (!context._controls) {
            console.info("[node wdio-ui5] creating internal control map")
            context._controls = {}
        }
        const internalKey = control.wdio_ui5_key
        if (!context._controls[internalKey]) {
            const ui5control = context.getControl(control)
            context._controls[internalKey] = ui5control
            console.info(`[node wdio-ui5] creating internal control with id ${internalKey}`)
        } else {
            console.info(`[node wdio-ui5] reusing internal control with id ${internalKey}`)
        }

        // expose $context.as Control($ui5-selector)
        //  .getProperty (._getControl is intended for internal use only)
        return {
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
