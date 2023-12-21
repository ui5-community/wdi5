async function clientSide_executeObjectMethod(uuid, methodName, args) {
    return await browser.executeAsync(
        (uuid, methodName, args, done) => {
            window.wdi5.waitForUI5(
                window.wdi5.waitForUI5Options,
                // this callback is denoted "async" even though it is truely not
                // but what other way to `await` a potentially async UI5 managed object fn in here?
                async () => {
                    // DOM to UI5
                    const oObject = window.wdi5.objectMap[uuid]

                    // execute the function
                    // TODO: if (methodName === "getName") { debugger }
                    let result
                    let threw = false
                    let threwMessage = ""
                    if (oObject[methodName].constructor.name === "AsyncFunction") {
                        try {
                            result = await oObject[methodName].apply(oObject, args)
                        } catch (error) {
                            threw = true
                            threwMessage = JSON.stringify(error)
                            window.wdi5.Log.error(threwMessage)
                        }
                    } else {
                        result = oObject[methodName].apply(oObject, args)
                    }

                    // async message call rejected
                    if (threw) {
                        done({ status: 1, message: threwMessage })
                    }
                    // result mus be a primitive
                    else if (window.wdi5.isPrimitive(result)) {
                        // getter
                        done({ status: 0, result: result, returnType: "result" })
                    } else {
                        // create new object
                        const uuid = window.wdi5.saveObject(result)
                        const aProtoFunctions = window.wdi5.retrieveControlMethods(result, true)

                        result = window.wdi5.collapseObject(result)

                        const collapsedAndNonCyclic = JSON.parse(
                            JSON.stringify(result, window.wdi5.getCircularReplacer())
                        )
                        // remove all empty Array elements, inlcuding private keys (starting with "_")
                        const semanticCleanedElements = window.wdi5.removeEmptyElements(collapsedAndNonCyclic)

                        done({
                            status: 0,
                            object: semanticCleanedElements,
                            uuid: uuid,
                            returnType: "object",
                            aProtoFunctions: aProtoFunctions
                        })
                    }
                },
                window.wdi5.errorHandling.bind(this, done)
            )
        },
        uuid,
        methodName,
        args
    )
}

module.exports = {
    clientSide_executeObjectMethod
}
