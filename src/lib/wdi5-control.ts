import * as util from "util"

import { clientSide_getControl } from "../../client-side-js/getControl"
import { clientSide_interactWithControl } from "../../client-side-js/interactWithControl"
import { clientSide_executeControlMethod } from "../../client-side-js/executeControlMethod"
import { clientSide_getAggregation } from "../../client-side-js/_getAggregation"
import { clientSide_fireEvent } from "../../client-side-js/fireEvent"
import { wdi5ControlMetadata, wdi5Selector } from "../types/wdi5.types"
import { Logger as _Logger } from "./Logger"

const Logger = _Logger.getInstance()

/**
 * This is a bridge object to use from selector to UI5 control,
 * can be seen as a generic representation of a UI5 control
 */
export class WDI5Control {
    _controlSelector: wdi5Selector = null
    // return value of Webdriver interface: JSON web token
    _webElement: WebdriverIO.Element | string = null // TODO: type "org.openqa.selenium.WebElement"
    // wdio elment retrieved separately via $()
    _webdriverRepresentation: WebdriverIO.Element = null
    _metadata: wdi5ControlMetadata = {}

    // TODO: move to _metadata
    _wdio_ui5_key: string = null
    _generatedUI5Methods: Array<string>
    _initialisation = false
    _forceSelect = false
    _wdioBridge = <WebdriverIO.Element>{}
    _generatedWdioMethods: Array<string>
    _domId: string

    constructor(oOptions) {
        const {
            controlSelector,
            wdio_ui5_key,
            forceSelect,
            generatedUI5Methods,
            webdriverRepresentation,
            webElement,
            domId
        } = oOptions

        this._controlSelector = controlSelector
        this._wdio_ui5_key = wdio_ui5_key
        this._forceSelect = forceSelect
        this._generatedUI5Methods = generatedUI5Methods
        this._webElement = webElement
        this._webdriverRepresentation = webdriverRepresentation
        this._domId = domId

        this.attachControlBridge(this._generatedUI5Methods as Array<string>)
        this.attachWdioControlBridge(this._generatedWdioMethods as Array<string>)

        this.setControlInfo()

        // set the succesful init param
        this._initialisation = true

        return this
    }

    async init(controlSelector = this._controlSelector, forceSelect = this._forceSelect) {
        this._controlSelector = controlSelector
        this._wdio_ui5_key = controlSelector.wdio_ui5_key
        this._forceSelect = forceSelect

        const controlResult = await this.getControl()

        if (typeof controlResult[0] === "string" && controlResult[0].toLowerCase().includes("error:")) {
            // result is string and has error text -> its an error
            Logger.error(`error retrieving control: ${this._wdio_ui5_key}`)
            return this
        } else {
            this._webElement = controlResult[0]

            // dynamic function bridge
            this._generatedUI5Methods = controlResult[1]
            this.attachControlBridge(this._generatedUI5Methods as Array<string>)
            this.attachWdioControlBridge(this._generatedWdioMethods as Array<string>)

            this.setControlInfo()

            // set the succesful init param
            this._initialisation = true
        }

        return this
    }

    /**
     * @return whether this control was sucessfully initialised
     */
    getInitStatus(): boolean {
        return this._initialisation
    }

    getControlInfo(): wdi5ControlMetadata {
        return this._metadata
    }

    setControlInfo(
        metadata: wdi5ControlMetadata = {
            key: this._wdio_ui5_key,
            $: this._generatedWdioMethods,
            methods: this._generatedUI5Methods,
            id: this._domId
        }
    ) {
        this._metadata.$ = metadata.$ ? metadata.$ : this._metadata.$
        this._metadata.id = metadata.id ? metadata.id : this._metadata.id
        this._metadata.methods = metadata.methods ? metadata.methods : this._metadata.methods
        this._metadata.className = metadata.className ? metadata.className : this._metadata.className
        this._metadata.key = metadata.key ? metadata.key : this._metadata.key

        return this._metadata
    }

    /**
     * @return {WebdriverIO.Element} the webdriver Element
     */
    async getWebElement() {
        if (!this._webdriverRepresentation) {
            // to enable transition from wdi5 to wdio api in allControls
            await this.renewWebElement()
        }
        //// TODO: check this "fix"
        //// why is the renew necessary here?
        //// it causes hiccup with the fluent async api as the transition from node-scope
        //// to browser-scope errors out (in .getControl client-side)
        // if (this._forceSelect) {
        //     await this.renewWebElementReference()
        // }
        if (util.types.isProxy(this.getWebElement)) {
            const $el: WebdriverIO.Element = await Promise.resolve(this._webdriverRepresentation) // to plug into fluent async api
            return $el
        } else {
            return this._webdriverRepresentation
        }
    }

    /**
     * add conveniance to the getWebElement Function
     * @returns {WebdriverIO.Element} the webdriver Element
     */
    $() {
        return this._wdioBridge // this.getWebElement()
    }

    /**
     * @param id
     * @returns
     */
    async renewWebElement(id: string = this._domId) {
        this._webdriverRepresentation = await $(`//*[@id="${id}"]`)
        return this._webdriverRepresentation
    }

    /**
     * bridge to UI5 control api "getAggregation"
     * @param name name of the aggregation
     * @return array of UI5 controls representing the aggregation
     */
    async getAggregation(name: string) {
        const _forceSelect: boolean = util.types.isProxy(this._forceSelect)
            ? await Promise.resolve(this._forceSelect)
            : this._forceSelect

        if (_forceSelect) {
            await this.renewWebElementReference()
        }
        return await this._getAggregation(name)
    }

    /**
     * enters a text into a UI5 control
     * @param text
     */
    async enterText(text: string) {
        // if (this._forceSelect) {
        //     this.renewWebElementReference();
        // }

        const oOptions = {
            enterText: text,
            selector: this._controlSelector.selector,
            clearTextFirst: true,
            interactionType: "ENTER_TEXT"
        }
        await this.interactWithControl(oOptions)
        return this
    }

    /**
     * click on a UI5 control
     * this works both on a standalone control as well as with the fluent async api
     */
    async press() {
        if (util.types.isProxy(this.getWebElement)) {
            const webelement = await Promise.resolve(this.getWebElement())
            await webelement.click()
        } else {
            await ((await this.getWebElement()) as unknown as WebdriverIO.Element).click()
        }
        return this
    }

    /**
     * used to update the wdio control reference
     * this can be used to manually trigger an control reference update after a ui5 control rerendering
     * this method is also used wdi5-internally to implement the extended forceSelect option
     */
    async renewWebElementReference() {
        const newWebElement = (await this.getControl({ selector: { id: this._domId } }))[0] // added to have a more stable retrieval experience
        this._webElement = newWebElement
        return newWebElement
    }

    // --- private methods ---

    /**
     * retrieve UI5 control represenation of a UI5 control's aggregation
     *
     * @param aControls strings of IDs of aggregation items
     * @returns instances of wdi5 class per control in the aggregation
     */
    async _retrieveElements(aControls): Promise<Array<WDI5Control>> {
        const aResultOfPromises = []

        // check the validity of param
        if (aControls) {
            // loop through items
            aControls.forEach((item) => {
                // item id -> create selector
                const selector = {
                    wdio_ui5_key: item.id, // plugin-internal, not part of RecordReplay.ControlSelector
                    forceSelect: this._forceSelect,
                    selector: {
                        id: item.id
                    }
                }

                // get WDI5 control
                aResultOfPromises.push(browser.asControl(selector))
            })

            return await Promise.all(aResultOfPromises)
        } else {
            Logger.warn(`${this._wdio_ui5_key} has no aControls`)
        }
    }

    /**
     * retrieve UI5 control represenation of a UI5 control's aggregation
     *
     * @param eControl ID
     * @returns instances of wdi5 class per control in the aggregation
     */
    async _retrieveElement(eControl) {
        let eResult = {}

        // check the validity of param
        if (eControl) {
            // item id -> create selector
            const selector = {
                wdio_ui5_key: eControl.id, // plugin-internal, not part of RecordReplay.ControlSelector
                forceSelect: this._forceSelect,
                selector: {
                    id: eControl.id
                }
            }

            // get WDI5 control
            eResult = await browser.asControl(selector)
        } else {
            Logger.warn(`${this._wdio_ui5_key} has no aControls`)
        }

        return eResult
    }

    /**
     * attaches to the instance of this class the functions given in the parameter sReplFunctionNames
     *
     * @param sReplFunctionNames
     */
    private attachControlBridge(sReplFunctionNames: Array<string>) {
        // check the validity of param
        if (sReplFunctionNames) {
            sReplFunctionNames.forEach(async (sMethodName) => {
                this[sMethodName] = this.executeControlMethod.bind(this, sMethodName, this._webElement)
            })
        } else {
            Logger.warn(`${this._wdio_ui5_key} has no sReplFunctionNames`)
        }
    }

    private attachWdioControlBridge(sReplFunctionNames: Array<string>) {
        // check the validity of param
        if (sReplFunctionNames) {
            sReplFunctionNames.forEach(async (sMethodName) => {
                this._wdioBridge[sMethodName] = async (): Promise<any> => {
                    return await (await this.getWebElement())[sMethodName]()
                }
            })
        } else {
            Logger.warn(`${this._wdio_ui5_key} has no sReplFunctionNames`)
        }
    }

    /**
     * runtime - proxied browser-time UI5 controls' method at Node.js-runtime
     *
     * @param methodName UI5 control method
     * @param webElement representation of selected UI5 control in wdio
     * @param args proxied arguments to UI5 control method at runtime
     */
    private async executeControlMethod(
        methodName: string,
        webElement: WebdriverIO.Element | string = this._webElement,
        ...args
    ) {
        if (this._forceSelect) {
            this._webElement = await this.renewWebElementReference()
        }
        // special case for custom data attached to a UI5 control:
        // pass the arguments to the event handler (like UI5 handles and expects them) also
        // also here in Node.js runtime
        if (methodName === "fireEvent") {
            if (args[1] && typeof args[1]["eval"] === "function") {
                return await this.fireEvent(args[0], args[1], webElement)
            }
        }
        // returns the array of [0: "status", 1: result]

        // regular browser-time execution of UI5 control method
        const result = await clientSide_executeControlMethod(webElement, methodName, args)

        // create logging
        this.writeResultLog(result, methodName)

        switch (result[2]) {
            case "newElement":
                // retrieve and return another instance of a wdi5 control
                return await this._retrieveElement(result[1])
            case "element":
                // return $self after a called method of the wdi5 instance to allow method chaining
                return this
            case "result":
                return result[3] ? result[3].nonCircularResultObject : result[1]
            case "empty":
                Logger.warn("No data found in property or aggregation")
                return result[1]
            case "aggregation": // also applies for getAggregation convenience methods such as $ui5control.getItems()
                // check weather to retrieve all elements in the aggreation as ui5 controls
                if ((args.length > 0 && typeof args[0] === "boolean" && args[0] === false) || args.length === 0) {
                    // get all if param is false or undefined
                    return await this._retrieveElements(result[1])
                } else if (String(args[0]) && typeof args[0] === "number") {
                    // here we're retrieving the UI5 control at index args[0] from the aggregation
                    if (args[0] <= result[1].length) {
                        // retieve only one
                        // need some code of separate feature branch here
                        const wdioElement = result[1][args[0]]
                        return await this._retrieveElement(wdioElement)
                    } else {
                        console.error(
                            `tried to get an control at index: ${args[0]} of an aggregation outside of aggregation length: ${result[1].length}`
                        )
                    }
                } else {
                    // return wdio elements
                    return result[1]
                }
            case "none":
                return null
            default:
                return null
        }
    }

    /**
     * retrieve an aggregation's members as UI5 controls
     *
     * @param aggregationName
     * @param webElement
     * @return {any}
     */
    private async _getAggregation(
        aggregationName: string,
        webElement: WebdriverIO.Element | string = this._webElement
    ) {
        if (util.types.isProxy(webElement)) {
            webElement = await Promise.resolve(webElement)
        }
        const result = await clientSide_getAggregation(webElement, aggregationName)

        this.writeResultLog(result, "_getAggregation()")

        let wdiItems = []
        if (result[0] === "success") {
            wdiItems = await this._retrieveElements(result[1])
        }

        // else return empty array
        return wdiItems
    }

    // --- private actions ---

    /**
     * Interact with specific control.
     * @param {object} oOptions
     * @param {sap.ui.test.RecordReplay.ControlSelector} oOptions.selector - UI5 type
     * @param {sap.ui.test.RecordReplay.InteractionType} oOptions.interactionType - UI5 type
     * @param {string} oOptions.enterText
     * @param {boolean} oOptions.clearTextFirst
     */
    private async interactWithControl(oOptions) {
        const result = await clientSide_interactWithControl(oOptions)

        this.writeResultLog(result, "interactWithControl()")
        return result[1]
    }

    /**
     * fire a named event on a UI5 control
     * @param {String} eventName
     * @param {any} oOptions
     * @param {WebdriverIO.Element} webElement
     */
    async fireEvent(eventName, oOptions, webElement = this._webElement) {
        // Check the options have a eval property
        if (oOptions?.eval) {
            oOptions = "(" + oOptions.eval.toString() + ")"
        }
        const result = await clientSide_fireEvent(webElement, eventName, oOptions)
        this.writeResultLog(result, "_fireEvent()")
        return result[1]
    }

    // --- private internal ---

    /**
     * retrieve a DOM element via UI5 locator
     * @param {sap.ui.test.RecordReplay.ControlSelector} controlSelector
     * @return {[WebdriverIO.Element | String, [aProtoFunctions]]} UI5 control or error message, array of function names of this control
     */
    private async getControl(controlSelector = this._controlSelector) {
        // check whether we have a "by id regex" locator request
        if (controlSelector.selector.id && typeof controlSelector.selector.id === "object") {
            // make it a string for serializing into browser-scope and
            // further processing there
            controlSelector.selector.id = controlSelector.selector.id.toString()
        }

        // check whether we have a (partial) text matcher
        // that should match:
        // properties: {
        //     text: new RegExp(/.*ersi.*/gm)
        // }
        // ...but not:
        // properties: {
        //     text: {
        //         regex: {
        //             source: '.*ersi.*',
        //             flags: 'gm'
        //         }
        //     }
        // }
        if (
            typeof controlSelector.selector.properties?.text === "object" &&
            controlSelector.selector.properties?.text instanceof RegExp
        ) {
            // make it a string for serializing into browser-scope and
            // further processing there
            controlSelector.selector.properties.text = controlSelector.selector.properties.text.toString()
        }

        const _result = await clientSide_getControl(controlSelector)
        const { domElement, id, aProtoFunctions, className } = _result[1]
        const result = _result[0]

        // TODO: move to constructor?
        // save the webdriver representation by control id
        if (result) {
            // only if the result is valid
            this._webdriverRepresentation = await $(`//*[@id="${id}"]`)
            this._generatedWdioMethods = this._retrieveControlMethods(this._webdriverRepresentation)

            // add metadata
            this._metadata.className = className
            this._domId = id
        }

        this.writeObjectResultLog(_result, "getControl()")

        return [domElement, aProtoFunctions]
    }

    private writeObjectResultLog(result, functionName) {
        if (result[0] === "error") {
            Logger.error(`call of ${functionName} failed because of: ${result[1]}`)
        } else if (result[0] === "success") {
            Logger.success(`call of function ${functionName} returned: ${JSON.stringify(result[1].domElement)}`)
        } else {
            Logger.warn(`Unknown status: ${functionName} returned: ${JSON.stringify(result[1])}`)
        }
    }

    /**
     *
     * @param {WebDriver.Element} control
     * @returns {Array<string>}
     */
    private _retrieveControlMethods(control) {
        const _control = control
        // create keys of all parent prototypes
        const properties = new Set()
        do {
            Object.getOwnPropertyNames(control).map((item) => properties.add(item))
        } while ((control = Object.getPrototypeOf(control)))

        // @ts-ignore
        const controlMethodsToProxy = [...properties.keys()].filter((item: string) => {
            if (typeof _control[item] === "function") {
                // function

                // filter private methods
                if (item.startsWith("_")) {
                    return false
                }

                // filter not working methods
                // and those with a specific api from wdi5/wdio-ui5-service
                const aFilterFunctions = ["$", "constructor"]

                if (aFilterFunctions.includes(item)) {
                    return false
                }

                /* if (item.startsWith("is")) {
                    // only check functions
                    return true
                } */

                return true
            }
            return false
        })

        return controlMethodsToProxy as Array<string>
    }

    /**
     * create log based on the status of result[0]
     * @param {Array} result
     * @param {*} functionName
     */
    private writeResultLog(result, functionName) {
        if (result[0] === "error") {
            Logger.error(`call of ${functionName} failed because of: ${result[1]}`)
        } else if (result[0] === "success") {
            Logger.success(`call of function ${functionName} returned: ${JSON.stringify(result[1])}`)
        } else {
            Logger.warn(`Unknown status: ${functionName} returned: ${JSON.stringify(result[1])}`)
        }
    }
}
