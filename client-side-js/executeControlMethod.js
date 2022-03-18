async function clientSide_executeControlMethod(webElement, methodName, controlType, args) {
    return await browser.executeAsync(
        (webElement, methodName, controlType, args, done) => {
            window.bridge.waitForUI5(window.wdi5.waitForUI5Options).then(() => {
                // DOM to UI5
                const oControl = window.wdi5.getUI5CtlForWebObj(webElement)
                // execute the function
                let result = oControl[methodName].apply(oControl, args)
                const metadata = oControl.getMetadata()
                if (Array.isArray(result)) {
                    // expect the method call delivers non-primitive results (like getId())
                    // but delivers a complex/structured type
                    // -> currenlty, only getAggregation(...) is supported
                    result = window.wdi5.createControlIdMap(result, controlType)
                    done(["success", result, "aggregation"])
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
                        } else {
                            // object, replacer function
                            // TODO: create usefull content from result
                            // result = JSON.stringify(result, window.wdi5.circularReplacer());

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
            })
        },
        webElement,
        methodName,
        controlType,
        args
    )
}

module.exports = {
    clientSide_executeControlMethod
}
