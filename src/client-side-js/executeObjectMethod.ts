import { browser } from "@wdio/globals"
import type RecordReplay from "sap/ui/test/RecordReplay"
import type { clientSide_ui5Response } from "../types/wdi5.types.js"

async function clientSide_executeObjectMethod(
    uuid: string,
    methodName: string,
    args: unknown[]
): Promise<clientSide_ui5Response> {
    // TODO: no access to global browser
    return await browser.execute(
        async function wdi5_executeObjectMethod(uuid, methodName, args) {
            try {
                await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)

                // DOM to UI5
                const oObject = window.wdi5.objectMap[uuid]

                // execute the function
                // TODO: if (methodName === "getName") { debugger }
                let result
                let threw = false
                let threwMessage = ""
                if (oObject[methodName as keyof typeof oObject].constructor.name === "AsyncFunction") {
                    try {
                        // eslint-disable-next-line prefer-spread
                        result = await oObject[methodName as keyof typeof oObject].apply(oObject, args)
                    } catch (error) {
                        threw = true
                        threwMessage = JSON.stringify(error)
                        window.wdi5.Log.error(threwMessage)
                    }
                } else {
                    // eslint-disable-next-line prefer-spread
                    result = oObject[methodName as keyof typeof oObject].apply(oObject, args)
                }

                // async message call rejected
                if (threw) {
                    return { status: 1, message: threwMessage }
                }
                // result must be a primitive
                else if (window.wdi5.isPrimitive(result)) {
                    // getter
                    return { status: 0, result: result, returnType: "result" }
                } else {
                    // create new object
                    const uuid = window.wdi5.saveObject(result)
                    const aProtoFunctions = window.wdi5.retrieveControlMethods(result)

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

export { clientSide_executeObjectMethod }
