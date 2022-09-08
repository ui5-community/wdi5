import * as util from "util"

import { clientSide_getControl } from "../../client-side-js/getControl"
import { clientSide_interactWithControl } from "../../client-side-js/interactWithControl"
import { clientSide_executeControlMethod } from "../../client-side-js/executeControlMethod"
import { clientSide_getAggregation } from "../../client-side-js/_getAggregation"
import { clientSide_fireEvent } from "../../client-side-js/fireEvent"
import { clientSide_ui5Response, wdi5ControlMetadata, wdi5Selector } from "../types/wdi5.types"
import { Logger as _Logger } from "./Logger"
import { wdioApi } from "./wdioApi"

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

    _browserInstance: WebdriverIO.Browser
    constructor(oOptions) {
        const {
            browserInstance,
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
        this._browserInstance = browserInstance
        this._webElement = webElement
        this._webdriverRepresentation = webdriverRepresentation
        this._domId = domId

        if (this._generatedUI5Methods && this._generatedUI5Methods.length > 0) {
            this._attachControlBridge(this._generatedUI5Methods as Array<string>)
        }
        if (this._generatedWdioMethods && this._generatedWdioMethods.length > 0) {
            this._attachWdioControlBridge(this._generatedWdioMethods as Array<string>)
        }

        this.setControlInfo()

        return this
    }

    async init(controlSelector = this._controlSelector, forceSelect = this._forceSelect) {
        this._controlSelector = controlSelector
        this._wdio_ui5_key = controlSelector.wdio_ui5_key
        this._forceSelect = forceSelect

        const controlResult = await this._getControl()

        if (controlResult.status === 1) {
            // result is string and has error text -> its an error
            Logger.error(`error retrieving control: ${this._wdio_ui5_key}`)
            return this
        } else {
            this._webElement = controlResult.domElement

            // dynamic function bridge
            this._generatedUI5Methods = controlResult.aProtoFunctions
            this._attachControlBridge(this._generatedUI5Methods as Array<string>)
            this._attachWdioControlBridge(this._generatedWdioMethods as Array<string>)

            this.setControlInfo()
        }

        return this
    }

    /**
     * after retrieving the ui5 control and connection this can be false eg. in cases when no DOM element was found by RecordReplay API
     * @return {Boolean} whether this control was sucessfully initialised
     */
    isInitialized(): boolean {
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
     * tries to retrieve the webdriver representation of the current wdi5 control
     * @return {WebdriverIO.Element} the webdriver Element
     */
    async getWebElement() {
        try {
            return await this._getWebElement()
        } catch (error) {
            Logger.error(`cannot call "getWebElement()", because ${error.message}`)
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
     * bridge to UI5 control api "getAggregation"
     * @param name name of the aggregation
     * @return array of UI5 controls representing the aggregation
     */
    async getAggregation(name: string) {
        try {
            return await this._getAggregation(name)
        } catch (error) {
            Logger.error(`cannot get aggregation "${name}", because ${error.message}`)
        }
    }

    /**
     * enters a text into a UI5 control
     * @param text
     */
    async enterText(text: string) {
        let selector
        if (util.types.isProxy(this._controlSelector)) {
            const _controlSelector = await Promise.resolve(this._controlSelector)
            selector = await Promise.resolve(_controlSelector.selector)
        } else {
            selector = this._controlSelector.selector
        }
        const oOptions = {
            enterText: text,
            selector,
            clearTextFirst: true,
            interactionType: "ENTER_TEXT"
        }
        try {
            await this._interactWithControl(oOptions)
        } catch (error) {
            Logger.error(`cannot call enterText(), because ${error.message}`)
        }
        return this
    }

    /**
     * click on a UI5 control
     * this works both on a standalone control as well as with the fluent async api
     */
    async press() {
        // route operations on a sap.m.SearchField
        // via the RecordReplay api instead of via WebdriverIO
        // TODO: are there any other controls that require a special "interact with" behaviour?
        if (
            this.getControlInfo().className.includes("sap.m.SearchField") &&
            this._controlSelector.selector.interaction.match(/press/i)
        ) {
            const __selector: wdi5Selector = null
            const oOptions = {
                selector: __selector,
                clearTextFirst: true,
                interactionType: "PRESS"
            }
            // supporting fluent async api
            if (util.types.isProxy(this._domId)) {
                const _controlSelector = await Promise.resolve(this._controlSelector)
                const _selector = await Promise.resolve(_controlSelector.selector)
                oOptions.selector = _selector as wdi5Selector
            } else {
                oOptions.selector = this._controlSelector.selector as wdi5Selector
            }
            await this.interactWithControl(oOptions)
        } else {
            // interact via wdio

            try {
                await ((await this.getWebElement()) as unknown as WebdriverIO.Element).click()
            } catch (error) {
                Logger.error(`Can not call press(), because ${error.message}`)
            }
        }

        return this
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
        const result = (await clientSide_fireEvent(
            webElement,
            eventName,
            oOptions,
            this._browserInstance
        )) as clientSide_ui5Response
        this._writeObjectResultLog(result, "fireEvent()")
        return result.result
    }

    // --- deprecated ---

    /**
     * @deprecated -> use isInitialized()
     * @return {Boolean}
     */
    getInitStatus(): boolean {
        return this._initialisation
    }

    // --- private methods ---

    /**
     * Interact with specific control.
     * @param {object} oOptions
     * @param {sap.ui.test.RecordReplay.ControlSelector} oOptions.selector - UI5 type
     * @param {sap.ui.test.RecordReplay.InteractionType} oOptions.interactionType - UI5 type
     * @param {string} oOptions.enterText
     * @param {boolean} oOptions.clearTextFirst
     */
    private async _interactWithControl(oOptions) {
        if (this._domId) {
            const result = (await clientSide_interactWithControl(
                oOptions,
                this._browserInstance
            )) as clientSide_ui5Response

            this._writeObjectResultLog(result, "interactWithControl()")
            return result.result
        } else {
            throw Error("control could not be found")
        }
    }

    /**
     * returns the wdio web element.
     * @throws will throw an error when no DOM Element was found
     * @return {WebdriverIO.Element} the webdriver Element
     */
    private async _getWebElement() {
        if (util.types.isProxy(this._domId)) {
            const id = await Promise.resolve(this._domId)
            if (id) {
                const webElement = await $(`//*[@id="${id}"]`)
                return webElement
            } else {
                throw Error("control could not be found")
            }
        }
        if (!this._webdriverRepresentation) {
            // to enable transition from wdi5 to wdio api in allControls
            await this._renewWebElement()
        }
        return this._webdriverRepresentation
    }

    /**
     * @param id
     * @returns
     */
    private async _renewWebElement(id: string = this._domId) {
        if (this._domId) {
            this._webdriverRepresentation = await this._browserInstance.$(`//*[@id="${id}"]`)
            return this._webdriverRepresentation
        } else {
            throw Error("control could not be found")
        }
    }

    /**
     * retrieve UI5 control represenation of a UI5 control's aggregation
     *
     * @param aControls strings of IDs of aggregation items
     * @returns instances of wdi5 class per control in the aggregation
     */
    private async _retrieveElements(aControls): Promise<Array<WDI5Control>> {
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
                aResultOfPromises.push(this._browserInstance.asControl(selector))
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
    private async _retrieveElement(eControl) {
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
            eResult = await this._browserInstance.asControl(selector)
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
    private _attachControlBridge(sReplFunctionNames: Array<string>) {
        // check the validity of param
        if (sReplFunctionNames) {
            sReplFunctionNames.forEach(async (sMethodName) => {
                this[sMethodName] = this._executeControlMethod.bind(this, sMethodName, this._webElement)
            })
        } else {
            Logger.warn(`${this._wdio_ui5_key} has no sReplFunctionNames`)
        }
    }

    private _attachWdioControlBridge(sReplFunctionNames: Array<string>) {
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
    private async _executeControlMethod(
        methodName: string,
        webElement: WebdriverIO.Element | string = this._webElement,
        ...args
    ) {
        if (this._forceSelect) {
            try {
                this._webElement = await this._renewWebElementReference()
            } catch (error) {
                Logger.error(`cannot execute ${methodName}(), because ${error.message}`)
            }
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
        const result = (await clientSide_executeControlMethod(
            webElement,
            methodName,
            this._browserInstance,
            args
        )) as clientSide_ui5Response

        // create logging
        this._writeObjectResultLog(result, methodName)

        switch (result.returnType) {
            case "newElement":
                // retrieve and return another instance of a wdi5 control
                return await this._retrieveElement(result.result)
            case "element":
                // return $self after a called method of the wdi5 instance to allow method chaining
                return this
            case "result":
                return result.nonCircularResultObject ? result.nonCircularResultObject : result.result
            case "empty":
                Logger.warn("No data found in property or aggregation")
                return result.result
            case "aggregation": // also applies for getAggregation convenience methods such as $ui5control.getItems()
                // check weather to retrieve all elements in the aggreation as ui5 controls
                if ((args.length > 0 && typeof args[0] === "boolean" && args[0] === false) || args.length === 0) {
                    // get all if param is false or undefined
                    return await this._retrieveElements(result.result)
                } else if (String(args[0]) && typeof args[0] === "number") {
                    // here we're retrieving the UI5 control at index args[0] from the aggregation
                    if (args[0] <= result.result.length) {
                        // retieve only one
                        // need some code of separate feature branch here
                        const wdioElement = result.result[args[0]]
                        return await this._retrieveElement(wdioElement)
                    } else {
                        console.error(
                            `tried to get an control at index: ${args[0]} of an aggregation outside of aggregation length: ${result.result.length}`
                        )
                    }
                } else {
                    // return wdio elements
                    return result.result
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
     * @throws will throw an error when no webElement was found
     * @return {any}
     */
    private async _getAggregation(
        aggregationName: string,
        webElement: WebdriverIO.Element | string = this._webElement
    ) {
        const _forceSelect: boolean = util.types.isProxy(this._forceSelect)
            ? await Promise.resolve(this._forceSelect)
            : this._forceSelect

        if (_forceSelect) {
            await this._renewWebElementReference()
        }
        if (util.types.isProxy(webElement)) {
            webElement = await Promise.resolve(webElement)
        }
        if (!webElement) {
            throw Error("control could not be found")
        }
        const result = (await clientSide_getAggregation(
            webElement,
            aggregationName,
            this._browserInstance
        )) as clientSide_ui5Response

        this._writeObjectResultLog(result, "_getAggregation()")

        let wdiItems = []
        if (result.status === 0) {
            wdiItems = await this._retrieveElements(result.result)
        }

        // else return empty array
        return wdiItems
    }

    /**
     * used to update the wdio control reference
     * this can be used to manually trigger an control reference update after a ui5 control rerendering
     * this method is also used wdi5-internally to implement the extended forceSelect option
     */
    private async _renewWebElementReference() {
        if (this._domId) {
            const newWebElement = (await this._getControl({ selector: { id: this._domId } })).domElement // added to have a more stable retrieval experience
            this._webElement = newWebElement
            return newWebElement
        } else {
            throw Error("control could not be found")
        }
    }

    /**
     * retrieve a DOM element via UI5 locator
     * @param {sap.ui.test.RecordReplay.ControlSelector} controlSelector
     * @return {[WebdriverIO.Element | String, [aProtoFunctions]]} UI5 control or error message, array of function names of this control
     */
    private async _getControl(controlSelector = this._controlSelector) {
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

        const _result = (await clientSide_getControl(controlSelector, this._browserInstance)) as clientSide_ui5Response
        const { status, domElement, id, aProtoFunctions, className } = _result

        if (status === 0 && id) {
            // only if the result is valid
            this._generatedWdioMethods = wdioApi

            // add metadata
            this._metadata.className = className
            this._domId = id

            // set the succesful init param
            this._initialisation = true
        }

        this._writeObjectResultLog(_result, "_getControl()")

        return { status: status, domElement: domElement, aProtoFunctions: aProtoFunctions }
    }

    private _writeObjectResultLog(response: clientSide_ui5Response, functionName: string) {
        if (response.status > 0) {
            Logger.error(`call of ${functionName} failed because of: ${response.message}`)
        } else if (response.status === 0) {
            Logger.success(
                `call of function ${functionName} returned: ${JSON.stringify(
                    response.id ? response.id : response.result
                )}`
            )
        } else {
            Logger.warn(`Unknown status: ${functionName} returned: ${JSON.stringify(response.message)}`)
        }
    }
}
