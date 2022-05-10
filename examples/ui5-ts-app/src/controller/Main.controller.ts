import JSONModel from "sap/ui/model/json/JSONModel"
import BaseController from "./BaseController"
import MessageToast from "sap/m/MessageToast"
import Fragment from "sap/ui/core/Fragment"
import { jData } from "./jData"
import Event from "sap/ui/base/Event"
import CheckBox from "sap/m/CheckBox"
import oDataModel from "sap/ui/model/odata/v2/ODataModel"

/**
 * @namespace test.Sample.tsapp.controller
 */
export default class Main extends BaseController {
    dialog: any
    onInit(): void {
        ;(this.getOwnerComponent().getModel() as oDataModel).read("/Customers('TRAIH')")
        const jData: jData = {
            inputValue: "test Input Value !!!",
            buttonText: "Don't press me !!! -> binded",
            checkbox: false,
            barcode: ""
        }
        const testModel = new JSONModel(jData)
        this.getView().setModel(testModel, "testModel")
    }

    navFwd(): any {
        return this.getOwnerComponent().getRouter().navTo("RouteOther")
    }
    onBoo(_): void {
        MessageToast.show(`👻`)
    }

    onTest(oEvent: Event): void {
        this.onBoo(oEvent)
    }
    onSelect(oEvent: Event): void {
        const selectedProperty: boolean = (oEvent.getSource() as CheckBox).getProperty("selected")
        const selectedParameter: boolean = oEvent.getParameter("selected")
        MessageToast.show(`selectedProperty: ${selectedProperty} selectedParameter: ${selectedParameter}`)
    }

    onPress(oEvent: any): void {
        MessageToast.show(`${oEvent.getSource().getId()} pressed`)
    }

    async openDialog(): Promise<void> {
        if (!this.dialog) {
            this.dialog = await Fragment.load({ name: "test.Sample.tsapp.view.Dialog", controller: this })
            this.dialog.setModel(this.getView().getModel("i18n"), "i18n")
        }
        this.dialog.open()
    }

    close(): void {
        this.dialog.close()
    }
}
