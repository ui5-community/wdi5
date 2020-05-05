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
    _ui5Control = null;
    /** @type {String} */
    _wdio_ui5_key = null;

    /**
     * create a new bridge return object for a UI5 control
     */
    constructor(controlSelector, context) {
        this._context = context;
        this._controlSelector = controlSelector;
        this._wdio_ui5_key = controlSelector.wdio_ui5_key;

        // fire getControl just once when creating this webui5 object
        this._ui5Control = this._getControl();

        return this;
    }

    // --- public methods Getter ---

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
     * @return {Boolean} true if successfully set the property else: false
     */
    setProperty(name, value) {
        return this._setProperty(name, value);
    }

    // --- public actions ---

    /**
     * enters a text into this UI5 control
     * @param {*} text
     */
    enterText(text) {
        const oOptions = {
            enterText: text,
            selector: this._controlSelector.selector,
            clearTextFirst: true,
            interactionType: 'ENTER_TEXT'
        };
        return this._interactWithControl(oOptions);
    }

    /**
     * fires a press event on the control
     * @return {sap.ui.base.EventProvider|boolean}
     */
    press() {
        return this._fireEvent('press');
    }

    /**
     * fires a event with name on the UI5 control
     * needed for custom events (and non press events like the custom abstraction)
     * @param {String} eventName
     */
    fireEvent(eventName) {
        this._fireEvent(eventName);
    }

    // --- private methods ---

    /**
     * time itensive
     * @param {String} aggregationName
     * @param {WebdriverIO.Element} ui5Control
     * @param {WebdriverIO.BrowserObject} context
     * @return {any}
     */
    _getAggregation(aggregationName, ui5Control = this._ui5Control, context = this._context) {
        const result = context.executeAsync(
            (ui5Control, aggregationName, done) => {
                window.bridge.waitForUI5().then(() => {
                    // DOM to UI5
                    let oControl = jQuery(ui5Control).control(0);
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
                    // TODO: some proper error handling
                });
            },
            ui5Control,
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
     * @param {WebdriverIO.Element} ui5Control
     * @param {WebdriverIO.BrowserObject} context
     */
    _setProperty(propertyName, propertyValue, ui5Control = this._ui5Control, context = this._context) {
        const result = context.executeAsync(
            (ui5Control, propertyName, propertyValue, done) => {
                window.bridge.waitForUI5().then(() => {
                    try {
                        let oControl = jQuery(ui5Control).control(0);
                        oControl.setProperty(propertyName, propertyValue);
                        done(['success', ` '${propertyName}' is now '${propertyValue.toString()}'`]);
                    } catch (error) {
                        console.error(`[browser wido-ui5] setProperty failed because of: ${error}`);
                        done(['error', error.toString()]);
                        throw new Error(error.toString());
                    }
                });
            },
            ui5Control,
            propertyName,
            propertyValue
        );

        this._writeResultLog(result, '_setProperty()');
        return result[1];
    }

    /**
     *
     * @param {String} className
     * @param {WebdriverIO.Element} ui5Control
     * @param {WebdriverIO.BrowserObject} context
     */
    _hasStyleClass(className, ui5Control = this._ui5Control, context = this._context) {
        const result = context.executeAsync(
            (ui5Control, className, done) => {
                window.bridge.waitForUI5().then(() => {
                    const foundUi5Control = jQuery(ui5Control).control(0);
                    done(['success', foundUi5Control.hasStyleClass(className)]);
                    // TODO: some proper error handling
                });
            },
            ui5Control,
            className
        );

        this._writeResultLog(result, '_hasStyleClass()');
        return result[1];
    }

    /**
     * get the property value of a UI5 control
     * @param {WebdriverIO.Element} ui5Control
     * @param {String} propertyName
     * @param {WebdriverIO.BrowserObject} context
     * @return {any} value of the UI5 property
     */
    _getProperty(propertyName, ui5Control = this._ui5Control, context = this._context) {
        // returns the array of [0: "status", 1: result]
        const result = context.executeAsync(
            (ui5Control, propertyName, done) => {
                window.bridge.waitForUI5().then(() => {
                    // DOM to UI5
                    let oControl = jQuery(ui5Control).control(0);
                    let sProperty = '';
                    switch (propertyName) {
                        case 'id':
                            sProperty = oControl.getId();
                            break;

                        default:
                            sProperty = oControl.getProperty(propertyName);
                            break;
                    }
                    done(['success', sProperty]);
                    // TODO: some proper error handling
                });
            },
            ui5Control,
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
                    jQuery.sap.log.debug('[browser wdio-ui5] locating controlSelector');
                    oOptions.selector = window.wdi5.createMatcher(oOptions.selector);
                    return window.bridge.interactWithControl(oOptions);
                })
                .then((result) => {
                    jQuery.sap.log.debug('[browser wdio-ui5] interaction complete! - Message: ' + result);
                    done(['success', result]);
                })
                .catch((error) => {
                    jQuery.sap.log.error('[browser wdio-ui5] ERR: ', error);
                    // TODO: clarify the necessity of throw new Error
                    done(['error', error.toString()]);
                    throw new Error(error.toString());
                });
        }, oOptions);

        this._writeResultLog(result, '_interactWithControl()');
        return result[1];
    }

    /**
     * fire a named event on a UI5 control
     * @param {String} eventName
     * @param {WebdriverIO.Element} ui5Control
     * @param {WebdriverIO.BrowserObject} context
     */
    _fireEvent(eventName, ui5Control = this._ui5Control, context = this._context) {
        const result = context.executeAsync(
            (ui5Control, eventName, done) => {
                window.bridge.waitForUI5().then(() => {
                    console.info('[browser wdio-ui5] working ' + eventName + ' for ' + ui5Control);
                    // DOM to ui5
                    let oControl = jQuery(ui5Control).control(0);
                    if (oControl && oControl.hasListeners(eventName)) {
                        console.info('[browser wdio-ui5] firing ' + eventName + ' on ' + ui5Control);
                        // element existent and has the target event
                        let result = oControl.fireEvent(eventName);
                        // convert to boolean
                        done(['success', !!result]);
                    } else {
                        console.error("[browser wdio-ui5] couldn't find " + ui5Control);
                        done(['error', false]);
                    }
                });
            },
            ui5Control,
            eventName
        );
        this._writeResultLog(result, '_fireEvent()');
        return result[1];
    }

    // --- private internal ---

    /**
     * retrieve a DOM element via UI5 locator
     * @param {sap.ui.test.RecordReplay.ControlSelector} controlSelector
     * @param {WebdriverIO.BrowserObject} context
     * @return {[WebdriverIO.Element | String]} UI5 control or error message
     */
    _getControl(controlSelector = this._controlSelector, context = this._context) {
        const result = context.executeAsync((controlSelector, done) => {
            window.bridge
                .waitForUI5()
                .then(() => {
                    console.info('[browser wdio-ui5] locating ' + JSON.stringify(controlSelector));
                    controlSelector.selector = window.wdi5.createMatcher(controlSelector.selector);
                    return window.bridge.findDOMElementByControlSelector(controlSelector);
                })
                .then((domElement) => {
                    console.info('[browser wdio-ui5] control located! - Message: ' + JSON.stringify(domElement));
                    done(['success', domElement]);
                })
                .catch((error) => {
                    console.error('[browser wdio-ui5] ERR: ', error);
                    done(['error', error.toString()]);
                    throw new Error('ERR: getControl() failed because of: ' + error.toString());
                });
        }, controlSelector);

        this._writeResultLog(result, '_getControl()');
        return result[1];
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
