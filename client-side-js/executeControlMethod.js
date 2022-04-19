async function clientSide_executeControlMethod(webElement, methodName, args) {
    return await browser.executeAsync(
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
                            done(["success", result, "empty"])
                        } else if (result[0]?.getParent) {
                            // expect the method call delivers non-primitive results (like getId())
                            // but delivers a complex/structured type
                            // -> currenlty, only getAggregation(...) is supported

                            // read classname eg. sap.m.ComboBox
                            controlType = oControl.getMetadata()._sClassName

                            result = window.wdi5.createControlIdMap(result, controlType)
                            done(["success", result, "aggregation"])
                        } else {
                            done(["success", result, "result"])
                        }
                    } else {
                        // ui5 api <control>.focus() doesn't have return value
                        if (methodName === "focus" && result === undefined) {
                            done([
                                "success",
                                `called focus() on wdi5 representation of a ${metadata.getElementName()}`,
                                "element"
                            ])
                        } else if (result === undefined || result === null) {
                            done([
                                "error",
                                `function ${methodName} does not exist on control ${metadata.getElementName()}!`,
                                "none"
                            ])
                        } else {
                            // result mus be a primitive
                            if (window.wdi5.isPrimitive(result)) {
                                // getter
                                done(["success", result, "result"])
                            } else if (
                                typeof result === "object" &&
                                result !== null &&
                                // wdi5 returns a wdi5 control if the UI5 api return its control
                                // allows method chaining
                                !(result instanceof sap.ui.core.Control)
                            ) {
                                // object, replacer function
                                // create usefull content from result
                                while (window.wdi5.isCyclic(result)) {
                                    result = JSON.parse(
                                        JSON.stringify(
                                            window.wdi5.removeCyclic(result),
                                            window.wdi5.getCircularReplacer()
                                        )
                                    )
                                }
                                done(["success", result, "result", { nonCircularResultObject: result }])
                            } else {
                                // check if of control to verify if the method result is a different control
                                if (result && result.getId && oControl.getId() !== result.getId()) {
                                    // ui5 function like get parent might return another ui5 control -> return it to check with this wdi5 instance
                                    result = window.wdi5.createControlId(result)
                                    done(["success", result, "newElement"])
                                } else {
                                    done([
                                        "success",
                                        `instance of wdi5 representation of a ${metadata.getElementName()}`,
                                        "element"
                                    ])
                                }
                            }
                        }
                    }
                },
                (error) => {
                    window.wdi5.Log.error("[browser wdi5] ERR: ", error)
                    done(["error", error.toString()])
                }
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
