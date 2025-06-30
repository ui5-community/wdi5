import type RecordReplay from "sap/ui/test/RecordReplay"
import type { wdi5Control } from "../types/wdi5.types.js"
import { Logger } from "../lib/Logger.js"

const logger = Logger.getInstance()

/**
 * Execute method on the ui5 control through the browser. Here the real magic happens :)
 * @param {Object} webElement representation of a webElement in node depending on the protocol
 * @param {String} methodName function name to be called on the ui5 control
 * @param {WebdriverIO.Browser} browserInstance
 * @param {Object} args proxied arguments to UI5 control method at runtime
 */
function executeControlMethod(
    webElement: WebdriverIO.Element,
    methodName: string,
    browserInstance: WebdriverIO.Browser,
    args: unknown
) {
    return browserInstance.execute(
        async (webElement, methodName, args) => {
            try {
                await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)

                // DOM to UI5
                const oControl = window.wdi5.getUI5CtlForWebObj(webElement)

                // execute the function
                // eslint-disable-next-line prefer-spread
                let result = oControl[methodName].apply(oControl, args)
                const metadata = oControl.getMetadata()

                if (Array.isArray(result)) {
                    if (result.length === 0) {
                        return { status: 0, result: result, returnType: "empty" }
                    } else if (result[0]?.getParent) {
                        // expect the method call delivers non-primitive results (like getId())
                        // but delivers a complex/structured type
                        // -> currenlty, only getAggregation(...) is supported
                        // read classname eg. sap.m.ComboBox
                        const controlType = oControl.getMetadata().getName()

                        result = window.wdi5.createControlIdMap(result, controlType)
                        return { status: 0, result: result, returnType: "aggregation" }
                    } else {
                        return { status: 0, result: result, returnType: "result" }
                    }
                } else {
                    // ui5 api <control>.focus() doesn't have return value
                    if (methodName === "focus" && result === undefined) {
                        return {
                            status: 0,
                            result: `called focus() on wdi5 representation of a ${metadata.getElementName()}`,
                            returnType: "element"
                        }
                    } else if (methodName === "exec" && result && result.status > 0) {
                        return {
                            status: result.status,
                            message: result.message
                        }
                    } else if (result === undefined || result === null) {
                        return {
                            status: 1,
                            result: `function ${methodName} does not exist on control ${metadata.getElementName()}!`,
                            returnType: "none"
                        }
                    } else {
                        if (window.wdi5.isPrimitive(result)) {
                            return { status: 0, result: result, returnType: "result" }
                        } else if (
                            // we have an object that is not a UI5 control
                            typeof result === "object" &&
                            result !== null &&
                            // @ts-expect-error: Property 'core' does not exist on type 'typeof ui'
                            !(result instanceof sap.ui.core.Control) &&
                            // @ts-expect-error: Property 'core' does not exist on type 'typeof ui'
                            !(result instanceof sap.ui.core.Item)
                        ) {
                            // save before manipulate
                            const uuid = window.wdi5.saveObject(result)

                            // FIXME: extract, collapse and remove cylic in 1 step
                            // extract the methods first
                            const aProtoFunctions = window.wdi5.retrieveControlMethods(result)

                            // flatten the prototype so we have all funcs available
                            const collapsed = window.wdi5.collapseObject(result)
                            // exclude cyclic references
                            const collapsedAndNonCyclic = JSON.parse(
                                JSON.stringify(collapsed, window.wdi5.getCircularReplacer())
                            )
                            // remove all empty Array elements, inlcuding private keys (starting with "_")
                            const semanticCleanedElements = window.wdi5.removeEmptyElements(collapsedAndNonCyclic)

                            return {
                                status: 0,
                                object: semanticCleanedElements,
                                returnType: "object",
                                aProtoFunctions: aProtoFunctions,
                                uuid: uuid,
                                nonCircularResultObject: semanticCleanedElements
                            }
                        } else if (
                            typeof result === "object" &&
                            result !== null &&
                            // wdi5 returns a wdi5 control if the UI5 api return its control
                            // allows method chaining
                            // @ts-expect-error: Property 'base' does not exist on type 'typeof ui'
                            !(result instanceof sap.ui.base.Object)
                        ) {
                            return {
                                status: 2,
                                returnType: "unknown"
                            }
                        } else {
                            // we got ourselves a regular UI5 control
                            // check that we're not working against ourselves :)
                            if (result && result.getId && oControl.getId() !== result.getId()) {
                                // ui5 function like get parent might return another ui5 control -> return it to check with this wdi5 instance
                                result = window.wdi5.createControlId(result)
                                return { status: 0, result: result, returnType: "newElement" }
                            } else {
                                return {
                                    status: 0,
                                    result: `instance of wdi5 representation of a ${metadata.getElementName()}`,
                                    returnType: "element"
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                window.wdi5.errorHandling.bind(error)
            }
        },
        webElement,
        methodName,
        args
    )
}
/**
 * Execute method on the ui5 control through the browser. If element "is stale" we first retrieve it
 * from the browser again
 * @param {Object} webElement representation of a webElement in node depending on the protocol
 * @param {String} methodName function name to be called on the ui5 control
 * @param {WebdriverIO.Browser} browserInstance
 * @param {Object} args proxied arguments to UI5 control method at runtime
 * @param {WDI5Control} wdi5Control wdi5 representation of the ui5 control
 */
async function clientSide_executeControlMethod(
    webElement: WebdriverIO.Element,
    methodName: string,
    browserInstance: WebdriverIO.Browser,
    args: unknown,
    wdi5Control: wdi5Control
) {
    let result
    try {
        result = executeControlMethod(webElement, methodName, browserInstance, args)
    } catch (err) {
        // devtools and webdriver protocol don't share the same error message
        if (err.message?.includes("is stale") || err.message?.includes("stale element reference")) {
            logger.debug(`webElement ${JSON.stringify(webElement)} stale, trying to renew reference...`)
            const renewedWebElement = await wdi5Control.renewWebElementReference()
            if (renewedWebElement) {
                result = executeControlMethod(renewedWebElement, methodName, browserInstance, args)
                logger.debug(`successfully renewed reference: ${JSON.stringify(renewedWebElement)}`)
            } else {
                logger.error(`failed renewing reference for webElement: ${JSON.stringify(webElement)}`)
                result = {
                    status: 1,
                    message: `${methodName} could not be executed on control with selector: ${JSON.stringify(
                        wdi5Control._controlSelector
                    )}`
                }
            }
        } else {
            throw err
        }
    }
    return result
}

export { clientSide_executeControlMethod }
