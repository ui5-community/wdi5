// @ts-check
const logger = require("./Logger");

/**
 * this is a bridge object to use from selector to ui5 control
 */
module.exports = class WebUi5 {

    _context = null;
    _controlSelector = null;
    _ui5Control = null;
    _wdio_ui5_key = null;

    /**
     *
     */
    constructor(controlSelector, context) {
        this._context = context;
        this._controlSelector = controlSelector
        this._wdio_ui5_key = controlSelector.wdio_ui5_key;

        // fire getControl just once when creating this webui5 object
        const result = this._getControl();
        this._ui5Control = result[0] === 'success' ? result[1] : null;

        return this;
    }

    // --- public methods Getter ---

    /**
     *
     * @param {*} name
     */
    hasStyleClass(name) {
        return this._hasStyleClass(name)
    }

    getProperty(name) {
        return this._getProperty(name)
    }

    getAggregation(name) {
        return this._getAggregation(name)
    }

    isVisible() {
        return this._isVisible()
    }

    // --- public methods Setter ---

    setProperty(name, value) {
        return this._setProperty(name, value)
    }

    // --- public actions ---

    /**
     * enters a text into this ui5 control
     * @param {*} text
     */
    enterText(text) {
        const oOptions = {
            enterText: text,
            selector: this._controlSelector.selector,
            clearTextFirst: true,
            interactionType: "ENTER_TEXT"
        }
        return this._interactWithControl(oOptions)
    }

    press() {
        return this._fireEvent("press")
    }

    // --- private methods ---

    _isVisible(controlSelector = this._controlSelector, context = this._context) {
        // reuse the ui5 getProperty method
        this._getProperty("visible")
    }

    _getAggregation(controlSelector = this._ui5Control, propertyName, context) {
        return context.executeAsync(
            (controlSelector, propertyName, done) => {
                return window.bridge.waitForUI5().then(() => {
                    // DOM to ui5
                    // TODO: use other method to get control
                    let oControl = jQuery(controlSelector).control(0)
                    let cAggregation = oControl.getAggregation(propertyName)
                    done(cAggregation)
                })
            },
            controlSelector,
            propertyName
        )
    }


    // TODO: implement on webui5
    _isFocusedDeep(controlSelector = this._controlSelector, context = this._context) {
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
        }, controlSelector);
        return result
    }

    _setProperty(property, value, controlSelector = this._controlSelector, context = this._context) {
        return context.executeAsync((elem, property, value, done) => {
            return window.bridge.waitForUI5().then(() => {
                done(elem[property] = value)
            });
        }, controlSelector, property, value);
    }

    _setAttribute(attribute, value, controlSelector = this._controlSelector, context = this._context) {
        return context.executeAsync((elem, attribute, value, done) => {
            return window.bridge.waitForUI5().then(() => {
                done(elem.setAttribute(attribute, value))
            });
        }, controlSelector, attribute, value);
    };

    _removeAttribute(attribute, controlSelector = this._controlSelector, context = this._context) {
        return context.executeAsync((elem, attribute, done) => {
            return window.bridge.waitForUI5().then(() => {
                done(elem.removeAttribute(attribute))
            });
        }, controlSelector, attribute);
    };

    _hasStyleClass(className, controlSelector = this._ui5Control, context = this._context) {
        return context.executeAsync((controlSelector, className, done) => {
            return window.bridge.waitForUI5().then(() => {
                const ui5Control = jQuery(controlSelector).control(0)
                debugger
                done(ui5Control.hasStyleClass(className))
            });
        }, controlSelector, className);
    };

    /**
     * Interact with specific control.
     * @param {object} oOptions
     * @param {sap.ui.test.RecordReplay.ControlSelector} oOptions.selector - UI5 type
     * @param {sap.ui.test.RecordReplay.InteractionType} oOptions.interactionType - UI5 type
     * @param {string} oOptions.enterText
     * @param {boolean} oOptions.clearTextFirst
     * @param {object} context
     */
    _interactWithControl(oOptions, context = this._context) {
        return context.executeAsync((oOptions, done) => {

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
                })
                .catch(error => {
                    console.error("[browser wdio-ui5] ERR: ", error)
                    done(["error", error.toString()])
                })

        }, oOptions)
    }

    /**
     * get the property value of a UI5 control
     * @param {WebdriverIO.Element} controlSelector
     * @param {String} propertyName
     * @param {WebdriverIO.BrowserObject} context
     */
    _getProperty(propertyName, controlSelector = this._ui5Control, context = this._context) {
        return context.executeAsync(
            (controlSelector, propertyName, done) => {
                return window.bridge.waitForUI5().then(() => {
                    // DOM to ui5
                    // TODO: use other method to get control
                    let oControl = jQuery(controlSelector).control(0)
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
            controlSelector,
            propertyName
        )
    }

    /**
     * fire a named event on a ui5 control
     * @param {*} name
     * @param {*} controlSelector
     * @param {*} context
     */
    _fireEvent(name, controlSelector = this._ui5Control, context = this._context) {
        return context.executeAsync(
            (controlSelector, name, done) => {
                return window.bridge.waitForUI5().then(() => {
                    // DOM to ui5
                    let oControl = jQuery(controlSelector).control(0)
                    if (oControl && oControl.hasListeners(name)) {
                        // element existent and has the target event
                        let result = oControl.fireEvent(name);
                        // konvert to boolean
                        done(!!result)
                    } else {
                        done(false)
                    }
                })
            },
            controlSelector,
            name
        )
    }

    // --- private internal ---

    /**
     * retrieve a DOM element via UI5 locator
     * @param {sap.ui.test.RecordReplay.ControlSelector} control
     * @param {WebdriverIO.BrowserObject} context
     * @return [String, Object | String]
     *  1. success | error | unknown
     *  2. ui5Control | error message
     */
    _getControl(controlSelector = this._controlSelector, context = this._context) {
        const result = context.executeAsync((controlSelector, done) => {

            return window.bridge
                .waitForUI5()
                .then(() => {
                    console.log("[browser wdio-ui5] locating " + JSON.stringify(controlSelector))
                    controlSelector.selector = window.wdi5.createMatcher(controlSelector.selector);
                    return window.bridge.findDOMElementByControlSelector(controlSelector)
                })
                .then(domElement => {
                    console.log("[browser wdio-ui5] control located! - Message: " + JSON.stringify(domElement))
                    // TODO: improve error logging -> https://github.com/webdriverio/webdriverio/issues/999
                    done(["success", domElement])
                })
                .catch(error => {
                    console.error("[browser wdio-ui5] ERR: ", error)
                    done(["error", error.toString()])
                    throw new Error("[node wdio-ui5] ERR: getControl() failed because of: " + error.toString())
                })
        }, controlSelector)

        // handle control result
        if (Array.isArray(result)) {
            if (result[0] === 'error') {
                logger.error("[node wdio-ui5] ERR: call of getControl() failed because of: " + result[1])
                return result;
            } else if (result[0] === 'success') {
                logger.log(`[node wdio-ui5] call of function getControl() retuned: ${JSON.stringify(result[1])}`)
                return result;
            }
        } else {
            // Guess: was directly returned
            // create result array with uk as unknown status
            return ["unknown", result];
        }
    }
}
