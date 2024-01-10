import * as util from "util"
export const ELEMENT_KEY = "element-6066-11e4-a52e-4f735466cecf"
// TODO: import { ELEMENT_KEY } from "webdriverio/build/constants.js"
// patch in webdriverio repo?
import { clientSide_getControl } from "../../client-side-js/getControl.cjs"
import { clientSide_interactWithControl } from "../../client-side-js/interactWithControl.cjs"
import { clientSide_executeControlMethod } from "../../client-side-js/executeControlMethod.cjs"
import { clientSide_getAggregation } from "../../client-side-js/_getAggregation.cjs"
import { clientSide_fireEvent } from "../../client-side-js/fireEvent.cjs"
import { clientSide_ui5Response, wdi5ControlMetadata, wdi5Selector } from "../types/wdi5.types.js"
import { Logger as _Logger } from "./Logger.js"
import { wdioApi } from "./wdioApi.js"
import { WDI5Object } from "./wdi5-object.js"
const Logger = _Logger.getInstance()

/**
 * This is a bridge object to use from selector to UI5 control,
 * can be seen as a generic representation of a UI5 control
 */
export class WDI5Control {
    _controlSelector: wdi5Selector = null
    // return value of Webdriver interface: JSON web token
    _webElement: WebdriverIO.Element | string | undefined = null // TODO: type "org.openqa.selenium.WebElement"
    // wdio element retrieved separately via $()
    _webdriverRepresentation: WebdriverIO.Element = null
    _metadata: wdi5ControlMetadata = {}

    // TODO: move to _metadata
    _wdio_ui5_key: string = null
    _generatedUI5Methods: Array<string>
    _initialisation = false
    _forceSelect = false
    _logging: boolean
    _wdioBridge = <WebdriverIO.Element>{}
    _generatedWdioMethods: Array<string>
    _domId: string | undefined

    // these controls receive the specific "interaction": "press" operator
    // instead of a regular "click" event
    // see https://openui5.hana.ondemand.com/api/sap.ui.test.actions.Press#properties
    _specificInteractionControls = [
        "sap.m.ComboBox",
        "sap.m.SearchField",
        "sap.m.Input",
        "sap.m.List",
        "sap.m.Table",
        "sap.m.ObjectIdentifier",
        "sap.m.ObjectAttribute",
        "sap.m.Page",
        "sap.m.semantic.FullscreenPage",
        "sap.m.semantic.DetailPage",
        "sap.ui.comp.smartfilterbar.SmartFilterBar"
    ]

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
        this._logging = this._controlSelector?.logging ?? true

        const controlResult = await this._getControl()

        if (controlResult.status === 1) {
            // result is string and has error text -> its an error
            if (this._logging) {
                Logger.error(`error retrieving control: ${this._wdio_ui5_key}`)
            }
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
     * @return {Boolean} whether this control was successfully initialized
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
            if (this._logging) {
                Logger.error(`cannot call "getWebElement()", because ${error.message}`)
            }
        }
    }

    /**
     * add convenience to the getWebElement Function
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
            if (this._logging) {
                Logger.error(`cannot get aggregation "${name}", because ${error.message}`)
            }
        }
    }

    /**
     * enters a text into a UI5 control
     * @param text
     */
    async enterText(text: string) {
        let selector
        let logging
        if (util.types.isProxy(this._controlSelector)) {
            const _controlSelector = await Promise.resolve(this._controlSelector)
            selector = await Promise.resolve(_controlSelector.selector)
            logging = await Promise.resolve(this._logging)
        } else {
            selector = this._controlSelector.selector
            logging = this._logging
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
            if (logging) {
                Logger.error(`cannot call enterText(), because ${error.message}`)
            }
        }
        return this
    }

    /**
     * click on a UI5 control
     * this works both on a standalone control as well as with the fluent async api
     */
    async press() {
        // support fluent async api
        let className
        let controlSelector
        let specificInteractionControls
        let logging
        if (util.types.isProxy(this._domId)) {
            specificInteractionControls = await Promise.resolve(this._specificInteractionControls)
            const _controlInfo = await Promise.resolve(this._metadata)
            className = _controlInfo.className
            controlSelector = await Promise.resolve(this._controlSelector)
            logging = await Promise.resolve(this._logging)
        } else {
            specificInteractionControls = this._specificInteractionControls
            className = this.getControlInfo().className
            controlSelector = this._controlSelector
            logging = this._logging
        }

        // route operations on a sap.m.SearchField
        // via the RecordReplay api instead of via WebdriverIO
        if (
            specificInteractionControls.includes(className as string) &&
            controlSelector.selector.interaction.match(/press/i)
        ) {
            if (logging) {
                Logger.info(`using OPA5 Press action to interact with this ${className}...`)
            }
            const oOptions = {
                selector: controlSelector.selector,
                interactionType: "PRESS"
            }
            try {
                await this._interactWithControl(oOptions)
            } catch (error) {
                if (logging) {
                    Logger.error(`cannot issue OPA5-press() on control, because ${error.message}`)
                }
            }
        } else {
            // interact via wdio
            try {
                await ((await this._getWebElement()) as unknown as WebdriverIO.Element).click()
            } catch (error) {
                if (logging) {
                    Logger.error(`cannot call press(), because ${error.message}`)
                }
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
        if (this._logging) {
            this._writeObjectResultLog(result, "fireEvent()")
        }
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
        // const domId = util.types.isProxy(this._domId) ? await Promise.resolve(this._domId) : this._domId
        let domId
        let logging
        if (util.types.isProxy(this._domId)) {
            domId = await Promise.resolve(this._domId)
            logging = await Promise.resolve(this._logging)
        } else {
            domId = this._domId
            logging = this._logging
        }
        const browserInstance = util.types.isProxy(this._browserInstance)
            ? await Promise.resolve(this._browserInstance)
            : this._browserInstance

        if (domId) {
            const result = (await clientSide_interactWithControl(oOptions, browserInstance)) as clientSide_ui5Response
            if (logging) {
                this._writeObjectResultLog(result, "interactWithControl()")
            }
            // return result.result
            return this
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
     * retrieve UI5 control representation of a UI5 control's aggregation
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

                // get wdi5 control
                aResultOfPromises.push(this._browserInstance.asControl(selector))
            })

            return await Promise.all(aResultOfPromises)
        } else {
            if (this._logging) {
                Logger.warn(`${this._wdio_ui5_key} has no aControls`)
            }
        }
    }

    /**
     * retrieve UI5 control representation of a UI5 control's aggregation
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

            // get wdi5 control
            eResult = await this._browserInstance.asControl(selector)
        } else {
            if (this._logging) {
                Logger.warn(`${this._wdio_ui5_key} has no aControls`)
            }
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
            if (this._logging) {
                Logger.warn(`${this._wdio_ui5_key} has no sReplFunctionNames`)
            }
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
            if (this._logging) {
                Logger.warn(`${this._wdio_ui5_key} has no sReplFunctionNames`)
            }
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
                if (this._logging) {
                    Logger.error(`cannot execute ${methodName}(), because ${error.message}`)
                }
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

        //special case for exec, passed function needs to be converted to string to be passed to the browser
        if (methodName === "exec") {
            if (args[0] && typeof args[0] === "function") {
                args[0] = args[0].toString()
            } else if (this._logging) {
                Logger.error(`cannot execute ${methodName}(), because an argument of type function should be present`)
            }
        }

        // regular browser-time execution of UI5 control method
        const result = (await clientSide_executeControlMethod(
            webElement,
            methodName,
            this._browserInstance,
            args,
            // to safeguard "stale" elements in the devtools protocol we pass the whole wdi5 object
            this
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
            case "object":
                // enhance with uuid
                return new WDI5Object(result.uuid, result.aProtoFunctions, result.object)
            case "empty":
                if (this._logging) {
                    Logger.warn("No data found in property or aggregation")
                }
                return result.result
            case "aggregation": // also applies for getAggregation convenience methods such as $ui5control.getItems()
                // check weather to retrieve all elements in the aggreation as ui5 controls
                if ((args.length > 0 && typeof args[0] === "boolean" && args[0] === false) || args.length === 0) {
                    // get all if param is false or undefined
                    return await this._retrieveElements(result.result)
                } else if (String(args[0]) && typeof args[0] === "number") {
                    // here we're retrieving the UI5 control at index args[0] from the aggregation
                    if (args[0] <= result.result.length) {
                        // retrieve only one
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
            case "unknown":
                Logger.warn(`${methodName} returned unknown status`)
                return null
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

        const _logging: boolean = util.types.isProxy(this._logging)
            ? await Promise.resolve(this._logging)
            : this._logging

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
        if (_logging) {
            this._writeObjectResultLog(result, "_getAggregation()")
        }

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
     * @param {Boolean} isRefresh whether to treat the incoming call as a refresh attempt on a stale web element
     */

    private async _renewWebElementReference(isRefresh = false) {
        if (this._domId) {
            //> REVISIT: browser.allControls uses this._domId for selection
            const newWebElement = (
                await this._getControl(isRefresh ? this._controlSelector : { selector: { id: this._domId } })
            ).domElement // added to have a more stable retrieval experience
            if (!this.isInitialized()) {
                this._webElement = undefined
            } else {
                this._webElement = newWebElement
            }
            return newWebElement
        } else if (this._wdio_ui5_key && !this._forceSelect) {
            const fromCache = await this._getControl(this._controlSelector)
            this._webElement = fromCache.domElement
            return fromCache.domElement
        }
    }

    /**
     * expose internal API to refresh a stale web element reference
     * @param {Boolean} asRefresh whether to treat the incoming call as a refresh attempt on a stale web element
     */
    async renewWebElementReference(asRefresh = true) {
        return await this._renewWebElementReference(asRefresh)
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

        // When the WebDriver protocol is not used, the domElement is not set accordingly (via devtool protocol)
        // Therefore we get element reference by calling browser execute function manually
        if (_result.status === 0 && !_result.domElement[ELEMENT_KEY]) {
            const elementReference = (await this._browserInstance.execute((id) => {
                const webElement: Node = document.evaluate(
                    `//*[@id='${id}']`,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue
                return webElement
            }, _result.id)) as unknown as WebdriverIO.Element
            _result.domElement = elementReference
        }

        const { status, domElement, id, aProtoFunctions, className } = _result

        if (status === 0 && id) {
            // only if the result is valid
            this._generatedWdioMethods = wdioApi

            // add metadata
            this._metadata.className = className
            this._domId = id

            // set the successful init param
            this._initialisation = true
        } else {
            this._initialisation = false
            this._domId = undefined
        }
        if (this._logging) {
            this._writeObjectResultLog(_result, "_getControl()")
        }

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
