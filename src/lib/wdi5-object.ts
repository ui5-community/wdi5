import { clientSide_executeObjectMethod } from "../../client-side-js/executeObjectMethod"
import { clientSide_ui5Response } from "../types/wdi5.types"
import { Logger as _Logger } from "./Logger"

const Logger = _Logger.getInstance()
/**
 * * Kind of equivalent representation of a sap.ui.base.Object
 */
export class WDI5Object {
    private _uuid: any
    private _aProtoFunctions: []

    constructor(uuid, aProtoFunctions) {
        this._uuid = uuid
        this._aProtoFunctions = aProtoFunctions

        this._attachObjectMethods(this._aProtoFunctions)
    }

    // TODO: remove just for testing
    /* async getPath(...args) {
        const result = (await clientSide_executeObjectMethod(this._uuid, "getPath", args)) as clientSide_ui5Response
        // returns type
        if (result.returnType === "result") {
            return result.result
        } else {
            return result
        }
    }

    async getBinding(...args) {
        const result = (await clientSide_executeObjectMethod(this._uuid, "getBinding", args)) as clientSide_ui5Response

        if (result.returnType === "object") {
            return new WDI5Object(result.result, result.aProtoFunctions)
        } else {
            return result.result
        }
    }

    async getModel(...args) {
        const result = (await clientSide_executeObjectMethod(this._uuid, "getModel", args)) as clientSide_ui5Response

        if (result.returnType === "object") {
            return new WDI5Object(result.result, result.aProtoFunctions)
        } else {
            return result.result
        }
    }

    async getProperty(...args) {
        const result = (await clientSide_executeObjectMethod(this._uuid, "getProperty", args)) as clientSide_ui5Response

        if (result.returnType === "object") {
            return new WDI5Object(result.result, result.aProtoFunctions)
        } else {
            return result.result
        }
    } */

    private async _excuteObjectMethod(methodName: string, uuid: string, ...args) {
        // call browser scope
        // regular browser-time execution of UI5 control method
        const result = (await clientSide_executeObjectMethod(uuid, methodName, args)) as clientSide_ui5Response

        // create logging
        this._writeObjectResultLog(result, methodName)

        if (result.returnType === "object") {
            return new WDI5Object(result.result, result.aProtoFunctions)
        } else {
            return result.result
        }
    }

    private _attachObjectMethods(sReplFunctionNames: Array<string>) {
        // loop over methods and attach
        // check the validity of param
        if (sReplFunctionNames) {
            sReplFunctionNames.forEach(async (sMethodName) => {
                this[sMethodName] = await this._excuteObjectMethod.bind(this, sMethodName, this._uuid)
            })
        } else {
            Logger.warn(`${this._uuid} has no sReplFunctionNames`)
        }
    }

    private _writeObjectResultLog(response: clientSide_ui5Response, functionName: string) {
        if (response.status > 0) {
            Logger.error(`call of ${functionName} failed because of: ${response.message}`)
        } else if (response.status === 0) {
            Logger.success(
                `call of function ${functionName} returned: ${JSON.stringify(
                    response.id ? response.id : response.result
                )}`
            )
        } else {
            Logger.warn(`Unknown status: ${functionName} returned: ${JSON.stringify(response.message)}`)
        }
    }
}
