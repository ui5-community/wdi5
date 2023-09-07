const { Logger } = require("../dist/lib/Logger.js")
const logger = Logger.getInstance()
/**
 * Execute method on the ui5 control through the browser. Here the real magic happens :)
 * @param {Object} webElement representation of a webElement in node depending on the protocol
 * @param {String} methodName function name to be called on the ui5 control
 * @param {WebdriverIO.Browser} browserInstance
 * @param {Object} args proxied arguments to UI5 control method at runtime
 */
async function executeControlMethod(webElement, methodName, browserInstance, args) {
    return await browserInstance.executeAsync(
        (webElement, methodName, args, done) => {
            window.wdi5.waitForUI5(
                window.wdi5.waitForUI5Options,
                () => {
                    // DOM to UI5
                    const oControl = window.wdi5.getUI5CtlForWebObj(webElement)

                    // execute the function
                    let result = oControl[methodName].apply(oControl, args)
                    const metadata = oControl.getMetadata()

                    if (Array.isArray(result)) {
                        if (result.length === 0) {
                            done({ status: 0, result: result, returnType: "empty" })
                        } else if (result[0]?.getParent) {
                            // expect the method call delivers non-primitive results (like getId())
                            // but delivers a complex/structured type
                            // -> currenlty, only getAggregation(...) is supported
                            // read classname eg. sap.m.ComboBox
                            controlType = oControl.getMetadata()._sClassName

                            result = window.wdi5.createControlIdMap(result, controlType)
                            done({ status: 0, result: result, returnType: "aggregation" })
                        } else {
                            done({ status: 0, result: result, returnType: "result" })
                        }
                    } else {
                        // ui5 api <control>.focus() doesn't have return value
                        if (methodName === "focus" && result === undefined) {
                            done({
                                status: 0,
                                result: `called focus() on wdi5 representation of a ${metadata.getElementName()}`,
                                returnType: "element"
                            })
                        } else if (methodName === "exec" && result && result.status > 0) {
                            done({
                                status: result.status,
                                message: result.message
                            })
                        } else if (result === undefined || result === null) {
                            done({
                                status: 1,
                                result: `function ${methodName} does not exist on control ${metadata.getElementName()}!`,
                                returnType: "none"
                            })
                        } else {
                            if (window.wdi5.isPrimitive(result)) {
                                done({ status: 0, result: result, returnType: "result" })
                            } else if (
                                // we have an object that is not a UI5 control
                                typeof result === "object" &&
                                result !== null &&
                                !(result instanceof sap.ui.core.Control) &&
                                !(result instanceof sap.ui.core.Item)
                            ) {
                                // save before manipulate
                                const uuid = window.wdi5.saveObject(result)

                                // FIXME: extract, collapse and remove cylic in 1 step
                                // extract the methods first
                                const aProtoFunctions = window.wdi5.retrieveControlMethods(result, true)

                                // flatten the prototype so we have all funcs available
                                const collapsed = window.wdi5.collapseObject(result)
                                // exclude cyclic references
                                const collapsedAndNonCyclic = JSON.parse(
                                    JSON.stringify(collapsed, window.wdi5.getCircularReplacer())
                                )
                                done({
                                    status: 0,
                                    object: collapsedAndNonCyclic,
                                    returnType: "object",
                                    aProtoFunctions: aProtoFunctions,
                                    uuid: uuid,
                                    nonCircularResultObject: collapsedAndNonCyclic
                                })
                            } else if (
                                typeof result === "object" &&
                                result !== null &&
                                // wdi5 returns a wdi5 control if the UI5 api return its control
                                // allows method chaining
                                !(result instanceof sap.ui.base.Object)
                            ) {
                                done({
                                    status: 2,
                                    returnType: "unknown"
                                })
                            } else {
                                // we got ourselves a regular UI5 control
                                // check that we're not working against ourselves :)
                                if (result && result.getId && oControl.getId() !== result.getId()) {
                                    // ui5 function like get parent might return another ui5 control -> return it to check with this wdi5 instance
                                    result = window.wdi5.createControlId(result)
                                    done({ status: 0, result: result, returnType: "newElement" })
                                } else {
                                    done({
                                        status: 0,
                                        result: `instance of wdi5 representation of a ${metadata.getElementName()}`,
                                        returnType: "element"
                                    })
                                }
                            }
                        }
                    }
                },
                window.wdi5.errorHandling.bind(this, done)
            )
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
async function clientSide_executeControlMethod(webElement, methodName, browserInstance, args, wdi5Control) {
    /**
     * @type {import("../src/types/wdi5.types.js").clientSide_ui5Response}
     * **/
    let result
    try {
        result = await executeControlMethod(webElement, methodName, browserInstance, args)
    } catch (err) {
        if (err.message?.includes("is stale") || err.message?.includes("stale element reference")) {
            logger.debug(`webElement ${JSON.stringify(webElement)} stale, trying to renew reference...`)
            let renewedWebElement = await wdi5Control.renewWebElementReference()
            if (renewedWebElement) {
                result = await executeControlMethod(renewedWebElement, methodName, browserInstance, args)
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

module.exports = {
    clientSide_executeControlMethod
}
