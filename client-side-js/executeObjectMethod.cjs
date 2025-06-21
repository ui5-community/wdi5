const { browser } = require("@wdio/globals")

async function clientSide_executeObjectMethod(uuid, methodName, args) {
    // TODO: no access to global browser
    return await browser.execute(
        async (uuid, methodName, args) => {
            try {
                await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)

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
                    return { status: 1, message: threwMessage }
                }
                // result mus be a primitive
                else if (window.wdi5.isPrimitive(result)) {
                    // getter
                    return { status: 0, result: result, returnType: "result" }
                } else {
                    // create new object
                    const uuid = window.wdi5.saveObject(result)
                    const aProtoFunctions = window.wdi5.retrieveControlMethods(result, true)

                    result = window.wdi5.collapseObject(result)

                    const collapsedAndNonCyclic = JSON.parse(JSON.stringify(result, window.wdi5.getCircularReplacer()))
                    // remove all empty Array elements, inlcuding private keys (starting with "_")
                    const semanticCleanedElements = window.wdi5.removeEmptyElements(collapsedAndNonCyclic)

                    return {
                        status: 0,
                        object: semanticCleanedElements,
                        uuid: uuid,
                        returnType: "object",
                        aProtoFunctions: aProtoFunctions
                    }
                }
            } catch (error) {
                window.wdi5.errorHandling(error)
            }
        },
        uuid,
        methodName,
        args
    )
}

module.exports = {
    clientSide_executeObjectMethod
}
