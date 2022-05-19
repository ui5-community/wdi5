/**
 * * Kind of equivalent representation of a sap.ui.base.Object
 */
export class WDI5Object {
    private _uuid: any
    private _aProtoFunctions: []

    constructor(uuid) {
        this._uuid = uuid
    }

    private _excuteObjectMethod(methodName: string) {
        // call browser scope
    }

    private _attachObjectMethods(methods: []) {
        // loop over methods and attach
    }
}
