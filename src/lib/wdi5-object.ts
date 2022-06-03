import { clientSide_executeObjectMethod } from "../../client-side-js/executeObjectMethod"
import { clientSide_ui5Response } from "../types/wdi5.types"
/**
 * * Kind of equivalent representation of a sap.ui.base.Object
 */
export class WDI5Object {
    private _uuid: any
    private _aProtoFunctions: []

    constructor(uuid) {
        this._uuid = uuid
    }

    // TODO: remove just for testing
    async getPath(...args) {
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
            return new WDI5Object(result.result)
        } else {
            return result.result
        }
    }

    async getModel(...args) {
        const result = (await clientSide_executeObjectMethod(this._uuid, "getModel", args)) as clientSide_ui5Response

        if (result.returnType === "object") {
            return new WDI5Object(result.result)
        } else {
            return result.result
        }
    }

    async getProperty(...args) {
        const result = (await clientSide_executeObjectMethod(this._uuid, "getProperty", args)) as clientSide_ui5Response

        if (result.returnType === "object") {
            return new WDI5Object(result.result)
        } else {
            return result.result
        }
    }

    private _excuteObjectMethod(methodName: string) {
        // call browser scope
    }

    private _attachObjectMethods(methods: []) {
        // loop over methods and attach
    }
}
