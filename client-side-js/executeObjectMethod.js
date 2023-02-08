async function clientSide_executeObjectMethod(uuid, methodName, args) {
    return await browser.executeAsync(
        (uuid, methodName, args, done) => {
            window.wdi5.waitForUI5(
                window.wdi5.waitForUI5Options,
                async () => {
                    // DOM to UI5
                    const oObject = window.wdi5.objectMap[uuid]

                    // execute the function
                    // TODO: if (methodName === "getName") { debugger }
                    let result
                    if (oObject[methodName].constructor.name === "AsyncFunction") {
                        try {
                            result = await oObject[methodName].apply(oObject, args)
                        } catch (error) {
                            window.wdi5.Log.error(JSON.stringify(error))
                            done({ status: 1, messsage: JSON.stringify(error) })
                        }
                    } else {
                        result = oObject[methodName].apply(oObject, args)
                    }

                    // result mus be a primitive
                    if (window.wdi5.isPrimitive(result)) {
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

                        done({
                            status: 0,
                            object: collapsedAndNonCyclic,
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
