import type {
    clientSide_ui5Response,
    wdi5ControlMetadata,
    wdi5Selector,
    wdi5ControlSelector,
    InteractWithControlOptions
} from "../types/wdi5.types.js"

import util from "node:util"
export const ELEMENT_KEY = "element-6066-11e4-a52e-4f735466cecf"
// TODO: import { ELEMENT_KEY } from "webdriverio/build/constants.js"
// patch in webdriverio repo?
import { clientSide_getControl } from "../client-side-js/getControl.js"
import { clientSide_interactWithControl } from "../client-side-js/interactWithControl.js"
import { clientSide_executeControlMethod } from "../client-side-js/executeControlMethod.js"
import { clientSide_getAggregation } from "../client-side-js/_getAggregation.js"
import { clientSide_checkForUI5Ready } from "../client-side-js/_checkForUI5Ready.js"
import { clientSide_fireEvent } from "../client-side-js/fireEvent.js"
import { Logger as _Logger } from "./Logger.js"
import { wdioApi } from "./wdioApi.js"
import { WDI5Object } from "./wdi5-object.js"
const Logger = _Logger.getInstance()

export type WDI5ControlParams = {
    browserInstance: WebdriverIO.Browser
    controlSelector?: wdi5Selector
    wdio_ui5_key?: string
    forceSelect?: boolean
    generatedUI5Methods?: string[]
    webdriverRepresentation?: WebdriverIO.Element
    webElement?: WebdriverIO.Element
    domId?: string
}

/**
 * This is a bridge object to use from selector to UI5 control,
 * can be seen as a generic representation of a UI5 control
 */
export class WDI5Control {
    _controlSelector?: WDI5ControlParams["controlSelector"]
    // return value of Webdriver interface: JSON web token
    _webElement?: WDI5ControlParams["webElement"]
    // wdio element retrieved separately via $()
    _webdriverRepresentation?: WDI5ControlParams["webdriverRepresentation"]
    _metadata: wdi5ControlMetadata = {}

    // TODO: move to _metadata
    _wdio_ui5_key?: WDI5ControlParams["wdio_ui5_key"]
    _generatedUI5Methods?: WDI5ControlParams["generatedUI5Methods"]
    _initialisation = false
    _forceSelect = false
    _logging: boolean
    _wdioBridge: WebdriverIO.Element
    _generatedWdioMethods?: string[]
    _domId?: WDI5ControlParams["domId"]
    _browserInstance: WDI5ControlParams["browserInstance"]
    constructor(oOptions: WDI5ControlParams) {
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

        this._wdioBridge = {} as WebdriverIO.Element
        this._controlSelector = controlSelector
        this._wdio_ui5_key = wdio_ui5_key
        this._forceSelect = forceSelect
        this._generatedUI5Methods = generatedUI5Methods
        this._browserInstance = browserInstance
        this._webElement = webElement
        this._webdriverRepresentation = webdriverRepresentation
        this._domId = domId
        this._logging = false

        if (this._generatedUI5Methods && this._generatedUI5Methods.length > 0) {
            this._attachControlBridge(this._generatedUI5Methods)
        }
        if (this._generatedWdioMethods && this._generatedWdioMethods.length > 0) {
            this._attachWdioControlBridge(this._generatedWdioMethods)
        }

        this.setControlInfo()

        return this
    }

    async init(controlSelector = this._controlSelector, forceSelect = this._forceSelect) {
        this._controlSelector = controlSelector
        this._wdio_ui5_key = controlSelector?.wdio_ui5_key
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
            this._attachControlBridge(this._generatedUI5Methods)
            this._attachWdioControlBridge(this._generatedWdioMethods)

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
                Logger.error(`cannot call "getWebElement()", because ${error?.message}`)
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
                Logger.error(`cannot get aggregation "${name}", because ${error?.message}`)
            }
        }
    }

    /**
     * enters a text into a UI5 control
     * @param text
     */
    async enterText(text: string) {
        let selector: wdi5ControlSelector
        let logging: boolean
        if (util.types.isProxy(this._controlSelector)) {
            const _controlSelector = await Promise.resolve(this._controlSelector)
            selector = await Promise.resolve(_controlSelector?.selector)
            logging = await Promise.resolve(this._logging)
        } else {
            selector = this._controlSelector?.selector
            logging = this._logging
        }
        const oOptions: InteractWithControlOptions = {
            enterText: text,
            selector: selector,
            // @ts-expect-error: Property 'clearTextFirst' does not exist on type 'RecordReplay.InteractWithControlOptions'.
            clearTextFirst: true,
            // @ts-expect-error: Property 'ENTER_TEXT' does not exist on type 'RecordReplay.InteractionType'.
            interactionType: "ENTER_TEXT"
        }
        try {
            await this._interactWithControl(oOptions)
        } catch (error) {
            if (logging) {
                Logger.error(`cannot call enterText(), because ${error?.message}`)
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
        let logging
        if (util.types.isProxy(this._domId)) {
            const _controlInfo = await Promise.resolve(this._metadata)
            className = _controlInfo.className
            controlSelector = await Promise.resolve(this._controlSelector)
            logging = await Promise.resolve(this._logging)
        } else {
            className = this.getControlInfo().className
            controlSelector = this._controlSelector
            logging = this._logging
        }

        // when the interaction locator is existing we want to use the RecordReplay press (interactWithControl)
        if (controlSelector?.selector?.interaction) {
            if (logging) {
                Logger.info(`using OPA5 Press action to interact with this ${className}...`)
            }
            const oOptions: InteractWithControlOptions = {
                selector: controlSelector.selector,
                // @ts-expect-error: Property 'PRESS' does not exist on type 'RecordReplay.InteractionType'.
                interactionType: "PRESS"
            }
            try {
                await this._interactWithControl(oOptions)
            } catch (error) {
                if (logging) {
                    Logger.error(`cannot issue OPA5-press() on control, because ${error?.message}`)
                }
            }
        } else {
            // interact via wdio
            try {
                await ((await this._getWebElement()) as unknown as WebdriverIO.Element).click()
            } catch (error) {
                if (logging) {
                    Logger.error(`cannot call press(), because ${error?.message}`)
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
    async fireEvent(eventName: string, oOptions, webElement = this._webElement) {
        // Check the options have a eval property
        if (oOptions?.eval) {
            oOptions = "(" + oOptions.eval.toString() + ")"
        }
        const result = await clientSide_fireEvent(webElement, eventName, oOptions, this._browserInstance)
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
     */
    private async _interactWithControl(oOptions: InteractWithControlOptions) {
        // const domId = util.types.isProxy(this._domId) ? await Promise.resolve(this._domId) : this._domId
        let domId: string
        let logging: boolean
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
            oOptions.selector = Object.assign(oOptions.selector, { id: domId })
            const result = await clientSide_interactWithControl(oOptions, browserInstance)
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
            // TODO: fix type issue
            const idAttribute = `//*[@id="${id}"]`
            this._webdriverRepresentation = (await this._browserInstance.$(
                idAttribute
            )) as unknown as WebdriverIO.Element
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
            for (const control of aControls) {
                // item id -> create selector
                const selector = {
                    wdio_ui5_key: control.id, // plugin-internal, not part of RecordReplay.ControlSelector
                    forceSelect: this._forceSelect,
                    selector: {
                        id: control.id
                    },
                    // skip the waitForUI5 check. We will do this manually once before the actual control retrieval
                    _skipWaitForUI5: true
                }

                // get wdi5 control
                aResultOfPromises.push(this._browserInstance.asControl(selector))
            }
            // waitForUI5 check manually
            await clientSide_checkForUI5Ready(this._browserInstance)
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
    private _attachControlBridge(sReplFunctionNames?: string[]) {
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

    private _attachWdioControlBridge(sReplFunctionNames?: string[]) {
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
    private async _executeControlMethod(methodName: string, webElement = this._webElement, ...args) {
        if (this._forceSelect) {
            try {
                this._webElement = await this._renewWebElementReference()
            } catch (error) {
                if (this._logging) {
                    Logger.error(`cannot execute ${methodName}(), because ${error?.message}`)
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
        let result: clientSide_ui5Response
        try {
            result = await clientSide_executeControlMethod(
                webElement,
                methodName,
                this._browserInstance,
                args,
                // to safeguard "stale" elements in the bidi protocol we pass the whole wdi5 object
                this
            )
        } catch (err) {
            let message
            if (err?.message?.includes("is stale") || err?.message?.includes("stale element reference")) {
                Logger.debug(`error executing ${methodName}(): ${err?.message}`)
                message = `stale element reference: ${methodName} could not be executed on control with selector: ${JSON.stringify(this._controlSelector)}`
            } else {
                Logger.error(`error executing ${methodName}(): ${err?.message}`)
                message = `error: ${methodName} could not be executed on control with selector: ${JSON.stringify(this._controlSelector)}`
            }
            result = {
                status: 1,
                message
            }
        }

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
                return new WDI5Object(result.uuid ?? "", result.aProtoFunctions, result.object)
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
                        Logger.error(
                            `tried to get an control at index: ${args[0]} of an aggregation outside of aggregation length: ${result.result.length}`
                        )
                    }
                } else {
                    // return wdio elements
                    return result.result
                }
            case "unknown": // eslint-disable-line no-fallthrough
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
    private async _getAggregation(aggregationName: string, webElement = this._webElement) {
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
        const result = await clientSide_getAggregation(webElement, aggregationName, this._browserInstance)
        if (_logging) {
            this._writeObjectResultLog(result, "_getAggregation()")
        }

        let wdiItems: WDI5Control[] = []
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
        if (controlSelector?.selector?.id && typeof controlSelector.selector.id === "object") {
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
            typeof controlSelector?.selector?.properties?.text === "object" &&
            controlSelector.selector.properties?.text instanceof RegExp
        ) {
            // make it a string for serializing into browser-scope and
            // further processing there
            controlSelector.selector.properties.text = controlSelector.selector.properties.text.toString()
        }

        const _result = await clientSide_getControl(controlSelector, this._browserInstance)

        // When the WebDriver protocol is not used, the domElement is not set accordingly (via devtool protocol)
        // Therefore we get element reference by calling browser execute function manually
        if (_result.status === 0 && !_result?.domElement?.[ELEMENT_KEY]) {
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
