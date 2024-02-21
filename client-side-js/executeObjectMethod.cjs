async function clientSide_executeObjectMethod(uuid, methodName, args) {
    return await browser.executeAsync(
        (uuid, methodName, args, done) => {
            //client-side-js/executeObjectMethod.cjs
            window.wdi5.waitForUI5(
                window.wdi5.waitForUI5Options,
                // this callback is denoted "async" even though it is truely not
                // but what other way to `await` a potentially async UI5 managed object fn in here?
                async () => {
                    window.wdi5.Log.info(`[browser wdi5] call function ${methodName} from object ${uuid}`)
                    // DOM to UI5
                    const oObject = window.wdi5.objectMap[uuid]

                    // execute the function
                    let result
                    if (oObject[methodName].constructor.name === "AsyncFunction") {
                        result = await oObject[methodName].apply(oObject, args)
                    } else {
                        result = oObject[methodName].apply(oObject, args)
                    }
                    // result musz be a primitive
                    if (window.wdi5.isPrimitive(result)) {
                        // getter
                        done({ status: 0, result: result, returnType: "result" })
                    } else {
                        const { semanticCleanedElements, uuid, aProtoFunctions, objectNames } =
                            window.wdi5.prepareObjectForSerialization(result)

                        done({
                            status: 0,
                            object: semanticCleanedElements,
                            uuid: uuid,
                            returnType: "object",
                            aProtoFunctions: aProtoFunctions,
                            objectNames
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
