import { clientSide_executeObjectMethod } from "../../client-side-js/executeObjectMethod.cjs"
import { clientSide_ui5Response } from "../types/wdi5.types"
import { Logger as _Logger } from "./Logger.js"

const Logger = _Logger.getInstance()
/**
 * equivalent representation of a sap.ui.base.Object in Node.js-scope
 */
export class WDI5Object {
    private _uuid: any
    private _aProtoFunctions: []
    private _baseObject: null

    constructor(uuid, aProtoFunctions, object) {
        this._uuid = uuid

        if (aProtoFunctions) {
            this._aProtoFunctions = aProtoFunctions
            this._attachObjectMethods(this._aProtoFunctions)
        } else {
            Logger.warn(`[WANING] creating object: ${uuid} without functions`)
        }

        if (object) {
            this._baseObject = object
            this._attachObjectProperties(this._baseObject)
        } else {
            Logger.warn(`[WANING] creating object: ${uuid} without properties`)
        }
    }

    public getUUID() {
        return this._uuid
    }

    private _attachObjectProperties(oObject: any) {
        for (const [key, value] of Object.entries(oObject)) {
            this[key] = value
        }
    }

    private async _excuteObjectMethod(methodName: string, uuid: string, ...args) {
        // call browser scope
        // regular browser-time execution of UI5 object method
        const result = (await clientSide_executeObjectMethod(uuid, methodName, args)) as clientSide_ui5Response

        // create logging
        this._writeObjectResultLog(result, methodName)

        if (result.returnType === "object") {
            return new WDI5Object(result.uuid, result.aProtoFunctions, result.object)
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
