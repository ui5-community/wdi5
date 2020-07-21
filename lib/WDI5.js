// @ts-check
const logger = require('./Logger');

/**
 * This is a bridge object to use from selector to UI5 control
 * This can be seen as a generic representation of a UI5 control used to interact with the UI5 control
 * This does not adjust the funcitonality based on a UI5 control type
 */
module.exports = class WDI5 {
    /** @type {WebdriverIO.BrowserObject} */
    _context = null;
    /**
     * control retrieved from browser-/native-context,
     * transferred to node-context
     * @typedef {Object} WDI5ControlSelector selected UI5 control
     * @property {String} wdio_ui5_key unique (wdi5-internal) key representing the UI5 control (selector)
     *
     */
    /** @type {WDI5ControlSelector} */
    _controlSelector = null;
    /** @type {[WebdriverIO.Element | String]} */
    _webElement = null;
    /** @type {[WebdriverIO.Element | String]} */
    _webdriverRepresentation = null;
    /** @type {String} */
    _wdio_ui5_key = null;
    /** @type {Array | String} */
    _generatedUI5Methods = null;

    /**
     * create a new bridge return object for a UI5 control
     */
    constructor(controlSelector, context) {
        this._context = context;
        this._controlSelector = controlSelector;
        this._wdio_ui5_key = controlSelector.wdio_ui5_key;

        // fire getControl just once when creating this webui5 object
        const controlResult = this._getControl()
        this._webElement = controlResult[0];

        // dynamic function bridge
        this._generatedUI5Methods = controlResult[1];
        this._attachControlBridge(this._generatedUI5Methods);

        return this;
    }

    // --- public methods Getter ---

    /**
     * @return the webdriver Element
     */
    getWebElement() {
        return this._webdriverRepresentation;
    }

    /**
     * bridge to UI5 control hasStyleClass Method
     * @param {String} name
     */
    hasStyleClass(name) {
        return this._hasStyleClass(name);
    }

    /**
     * bridge to UI5 control getProperty Method
     * @param {String} name
     */
    getProperty(name) {
        return this._getProperty(name);
    }

    /**
     * convenience shortcut for getting the id of a control
     */
    getId() {
        return this._getProperty('id');
    }
    /**
     * convenience shortcut for getting the text value of a control
     */
    getText() {
        return this._getProperty('text');
    }

    /**
     * convenience shortcut for getting the title text of a control
     */
    getTitle() {
        return this._getProperty('title');
    }

    /**
     * bridge to UI5 control getAggregation Method
     * @param {String} name
     * @return {any} content of the UI5 aggregation with name of parameter
     */
    getAggregation(name) {
        return this._getAggregation(name);
    }

    /**
     * shorthand for getProperty("visible")
     * bridge to UI5 control getVisible Method
     * @return {Boolean} value of the UI5 property visible
     */
    isVisible() {
        // reuse the UI5 getProperty method
        return this._getProperty('visible');
    }

    // --- public methods Setter ---

    /**
     * bridge to UI5 control setProperty Method
     * @param {String} name
     * @param {any} value
     * @return {WDI5} this for method chaining
     */
    setProperty(name, value) {
        this._setProperty(name, value);
        return this;
    }

    // --- public actions ---

    /**
     * enters a text into this UI5 control
     * @param {*} text
     * @return {WDI5} this for method chaining
     */
    enterText(text) {
        const oOptions = {
            enterText: text,
            selector: this._controlSelector.selector,
            clearTextFirst: true,
            interactionType: 'ENTER_TEXT'
        };
        this._interactWithControl(oOptions);
        return this;
    }

    /**
     * fires a press event on the control
     * @return {WDI5} this for method chaining
     */
    press() {
        this._fireEvent('press');
        return this;
    }

    /**
     * sap.m.CheckBox convenience function to check a checkbox
     * @return {WDI5} this for method chaining
     */
    check() {
        this._setProperty('selected', true);
        this._fireEvent('select', { selected: true });
        return this;
    }

    /**
     * sap.m.CheckBox convenience function to uncheck a checkbox
     * @return {WDI5} this for method chaining
     */
    uncheck() {
        this._setProperty('selected', false);
        this._fireEvent('select', { selected: false });
        return this;
    }

    /**
     * sap.m.CheckBox convenience function to toggle a checkboxes' state
     * @return {WDI5} this for method chaining
     */
    toggle() {
        const bState = this._getProperty('selected');
        this._setProperty('selected', !bState);
        this._fireEvent('select', { selected: !bState });
        return this;
    }

    /**
     * fires a event with name on the UI5 control
     * needed for custom events (and non press events like the custom abstraction)
     * @param {String} eventName
     * @return {WDI5} this for method chaining
     */
    fireEvent(eventName, oOptions) {
        this._fireEvent(eventName, oOptions);
        return this;
    }

    // --- private methods ---

    /**
     * attaches to the instamce of this class the functions givven in the parameter sReplFunctionNames
     * @param {Array} sReplFunctionNames
     */
    _attachControlBridge(sReplFunctionNames) {
        sReplFunctionNames.forEach(element => {

            // start after generic get/set
            let sPropertyName = element.substr(3, element.length)
            sPropertyName = sPropertyName[0].toLowerCase() + sPropertyName.slice(1);

            if (element.indexOf("get") !== -1) {
                this[element] = this.getProperty.bind(this, sPropertyName);
            } else if (element.indexOf("set") !== -1) {
                this[element] = this.setProperty.bind(this, sPropertyName) /*, value */;
            }
        });
    }

    /**
     * time itensive
     * @param {String} aggregationName
     * @param {WebdriverIO.Element} webElement
     * @param {WebdriverIO.BrowserObject} context
     * @return {any}
     */
    _getAggregation(aggregationName, webElement = this._webElement, context = this._context) {
        const result = context.executeAsync(
            (webElement, aggregationName, done) => {
                window.bridge.waitForUI5().then(() => {
                    // DOM to UI5
                    try {
                        let oControl = window.wdi5.getUI5CtlForWebObj(webElement);
                        let cAggregation = oControl.getAggregation(aggregationName);

                        // the array of UI5 controls need to be mapped (remove circular reference)
                        let result = cAggregation.map((element) => {
                            // just use the absolute ID of the control
                            let item = {
                                id: element.getId()
                            };
                            return item;
                        });

                        done(['success', result]);
                    } catch (e) {
                        done(['error', e.toString()]);
                    }
                });
            },
            webElement,
            aggregationName
        );

        this._writeResultLog(result, '_getAggregation()');

        let wdiItems = [];
        if (result[0] === 'success') {
            // loop through items
            result[1].forEach((item) => {
                // item id -> create selector
                const selector = {
                    wdio_ui5_key: item.id, // plugin-internal, not part of RecordReplay.ControlSelector
                    selector: {
                        id: item.id
                    }
                };

                // get WDI5 control
                wdiItems.push(context.asControl(selector));
            });
        }

        // else return empty array
        return wdiItems;
    }

    /**
     *
     * @param {String} propertyName
     * @param {any} propertyValue
     * @param {WebdriverIO.Element} webElement
     * @param {WebdriverIO.BrowserObject} context
     */
    _setProperty(propertyName, propertyValue, webElement = this._webElement, context = this._context) {
        const result = context.executeAsync(
            (webElement, propertyName, propertyValue, done) => {
                window.bridge.waitForUI5().then(() => {
                    try {
                        let oControl = window.wdi5.getUI5CtlForWebObj(webElement);
                        oControl.setProperty(propertyName, propertyValue);
                        done(['success', ` '${propertyName}' is now '${propertyValue.toString()}'`]);
                    } catch (error) {
                        window.wdi5.Log.error(`[browser wido-ui5] setProperty failed because of: ${error}`);
                        done(['error', error.toString()]);
                    }
                });
            },
            webElement,
            propertyName,
            propertyValue
        );

        this._writeResultLog(result, '_setProperty()');
        return result[1];
    }

    /**
     *
     * @param {String} className
     * @param {WebdriverIO.Element} webElement
     * @param {WebdriverIO.BrowserObject} context
     */
    _hasStyleClass(className, webElement = this._webElement, context = this._context) {
        const result = context.executeAsync(
            (webElement, className, done) => {
                window.bridge.waitForUI5().then(() => {
                    try {
                        const foundUI5Control = window.wdi5.getUI5CtlForWebObj(webElement);
                        done(['success', foundUI5Control.hasStyleClass(className)]);
                    } catch (e) {
                        done(['error', e.toString()]);
                    }
                });
            },
            webElement,
            className
        );

        this._writeResultLog(result, '_hasStyleClass()');
        return result[1];
    }

    /**
     * get the property value of a UI5 control
     * @param {WebdriverIO.Element} webElement
     * @param {String} propertyName
     * @param {WebdriverIO.BrowserObject} context
     * @return {any} value of the UI5 property
     */
    _getProperty(propertyName, webElement = this._webElement, context = this._context) {
        // returns the array of [0: "status", 1: result]
        const result = context.executeAsync(
            (webElement, propertyName, done) => {
                window.bridge.waitForUI5().then(() => {
                    // DOM to UI5
                    let oControl = window.wdi5.getUI5CtlForWebObj(webElement);
                    let sProperty = '';
                    switch (propertyName) {
                        case 'id':
                            sProperty = oControl.getId();
                            break;

                        default:
                            sProperty = oControl.getProperty(propertyName);
                            break;
                    }
                    if (sProperty === undefined || sProperty === null) {
                        done(['error', `property ${propertyName} not existent in control !`]);
                    } else {
                        done(['success', sProperty]);
                    }
                });
            },
            webElement,
            propertyName
        );

        // create logging
        this._writeResultLog(result, '_getProperty()');
        // return result on array index 1 anyways
        return result[1];
    }

    // --- private actions ---

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
        const result = context.executeAsync((oOptions, done) => {
            window.bridge
                .waitForUI5()
                .then(() => {
                    window.wdi5.Log.info('[browser wdio-ui5] locating controlSelector');
                    oOptions.selector = window.wdi5.createMatcher(oOptions.selector);
                    return window.bridge.interactWithControl(oOptions);
                })
                .then((result) => {
                    window.wdi5.Log.info('[browser wdio-ui5] interaction complete! - Message: ' + result);
                    done(['success', result]);
                })
                .catch((error) => {
                    window.wdi5.Log.error('[browser wdio-ui5] ERR: ', error);
                    done(['error', error.toString()]);
                });
        }, oOptions);

        this._writeResultLog(result, '_interactWithControl()');
        return result[1];
    }

    /**
     * fire a named event on a UI5 control
     * @param {String} eventName
     * @param {any} oOptions
     * @param {WebdriverIO.Element} webElement
     * @param {WebdriverIO.BrowserObject} context
     */
    _fireEvent(eventName, oOptions, webElement = this._webElement, context = this._context) {

        // Check the options have a eval property
        if (oOptions && oOptions.eval) {
            oOptions = '(' + oOptions.eval.toString() + ')'
        }

        const result = context.executeAsync(
            (webElement, eventName, oOptions, done) => {
                window.bridge.waitForUI5().then(() => {
                    window.wdi5.Log.info('[browser wdio-ui5] working ' + eventName + ' for ' + webElement);
                    // DOM to ui5
                    let oControl = window.wdi5.getUI5CtlForWebObj(webElement);
                    if (oControl && oControl.hasListeners(eventName)) {

                        window.wdi5.Log.info('[browser wdio-ui5] firing ' + eventName + ' on ' + webElement);
                        // element existent and has the target event
                        try {

                            // eval the options indicated by option of type string
                            if (typeof oOptions === "string") {
                                oOptions = eval(oOptions)();
                            }
                            oControl.fireEvent(eventName, oOptions);
                            // convert to boolean
                            done(['success', true]);
                        } catch (e) {
                            done(['error', e.toString()]);
                        }
                    } else {
                        window.wdi5.Log.error("[browser wdio-ui5] couldn't find " + webElement);
                        done(['error', false]);
                    }
                });
            },
            webElement,
            eventName,
            oOptions
        );
        this._writeResultLog(result, '_fireEvent()');
        return result[1];
    }

    // --- private internal ---

    /**
     * retrieve a DOM element via UI5 locator
     * @param {sap.ui.test.RecordReplay.ControlSelector} controlSelector
     * @param {WebdriverIO.BrowserObject} context
     * @return {[WebdriverIO.Element | String, [aProtoFunctions]]} UI5 control or error message, array of function names of this control
     */
    _getControl(controlSelector = this._controlSelector, context = this._context) {
        const result = context.executeAsync((controlSelector, done) => {

            window.bridge
                .waitForUI5()
                .then(() => {
                    window.wdi5.Log.info('[browser wdio-ui5] locating ' + JSON.stringify(controlSelector));
                    controlSelector.selector = window.wdi5.createMatcher(controlSelector.selector);
                    return window.bridge.findDOMElementByControlSelector(controlSelector);
                })
                .then((domElement) => {
                    window.wdi5.Log.info(
                        '[browser wdio-ui5] control located! - Message: ' + JSON.stringify(domElement)
                    );

                    // ui5 control
                    const ui5Control = window.wdi5.getUI5CtlForWebObj(domElement);
                    const id = ui5Control.getId();
                    const aProtoFunctions = window.wdi5.createControlMethod(ui5Control);

                    // @type [String, String?, String, "Array of Strings"]
                    done(['success', domElement, id, aProtoFunctions]);
                })
                .catch((error) => {
                    window.wdi5.Log.error('[browser wdio-ui5] ERR: ', error);
                    done(['error', error.toString()]);
                });
        }, controlSelector);

        // save the webdriver representation by control id
        this._webdriverRepresentation = $(`#${result[2]}`);

        this._writeResultLog(result, '_getControl()');

        return [result[1], result[3]];
    }

    /**
     * create log based on the status of result[0]
     * @param {Array} result
     * @param {*} functionName
     */
    _writeResultLog(result, functionName) {
        if (result[0] === 'error') {
            logger.error(`ERROR: call of ${functionName} failed because of: ${result[1]}`);
        } else if (result[0] === 'success') {
            logger.log(`SUCCESS: call of function ${functionName} returned: ${JSON.stringify(result[1])}`);
        } else {
            logger.warn(`Unknown status: ${functionName} returned: ${JSON.stringify(result[1])}`);
        }
    }
};
