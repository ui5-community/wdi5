async function clientSide_executeControlMethod(webElement, methodName, browserInstance, args) {
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
                                // flatten the prototype so we have all funcs available
                                const collapsed = window.wdi5.collapseObject(result)
                                // exclude cyclic references
                                const collapsedAndNonCyclic = JSON.parse(
                                    JSON.stringify(collapsed, window.wdi5.getCircularReplacer())
                                )
                                done({
                                    status: 0,
                                    result: collapsedAndNonCyclic,
                                    returnType: "result",
                                    nonCircularResultObject: collapsedAndNonCyclic
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

module.exports = {
    clientSide_executeControlMethod
}
