import JSONModel from "sap/ui/model/json/JSONModel"
import Device from "sap/ui/Device"
import BindingMode from "sap/ui/model/BindingMode"

export default {
    createDeviceModel(): JSONModel {
        const oModel = new JSONModel(Device)
        oModel.setDefaultBindingMode(BindingMode.OneWay)
        return oModel
    }
}
