import BaseController from "./BaseController"
import MessageToast from "sap/m/MessageToast"
import JSONModel from "sap/ui/model/json/JSONModel"
import Fragment from "sap/ui/core/Fragment"
import Dialog from "sap/m/Dialog"
import Text from "sap/m/Text"
import { Button$PressEvent } from "sap/m/Button"
import { CheckBox$SelectEvent } from "sap/m/CheckBox"
import { SearchField$SearchEvent } from "sap/m/SearchField"
import { Input$LiveChangeEvent } from "sap/m/Input"
import InputBase from "sap/m/InputBase"
import { InputBase$ChangeEvent } from "sap/m/InputBase"
import SearchField from "sap/m/SearchField"
import Input from "sap/m/Input"
import ODataModel from "sap/ui/model/odata/v2/ODataModel"
import Component from "../Component"

/**
 * @namespace test.Sample.controller
 */
export default class Main extends BaseController {
    private dialog: Dialog | undefined

    public onInit(): void {
        ;((this.getOwnerComponent() as Component).getModel() as ODataModel).read("/Customers('TRAIH')")

        const jData = {
            inputValue: "test Input Value !!!",
            buttonText: "Don't press me !!! -> binded",
            checkbox: false,
            barcode: ""
        }
        // TODO:
        // searchValue: "search Value"

        const testModel = new JSONModel(jData)
        this.getView()!.setModel(testModel, "testModel")

        this.initCombobox()
    }

    public initCombobox(): void {
        // set explored app's demo model on this sample
        const oModel = new JSONModel()
        oModel.loadData("model/countries.json")
        this.getView()!.setModel(oModel, "Countries")
    }

    public navCalendar(): void {
        ;(this.getOwnerComponent() as Component).getRouter().navTo("RouteCalendar")
    }

    public navFwd(): void {
        ;(this.getOwnerComponent() as Component).getRouter().navTo("RouteOther")
    }

    public onPress(oEvent: Button$PressEvent): void {
        MessageToast.show(`${oEvent.getSource().getId()} pressed`)
    }

    public onBoo(_oEvent: Button$PressEvent): void {
        MessageToast.show(`👻`)
    }

    public onSearch(oEvent: SearchField$SearchEvent): void {
        ;(this.getView()!.byId("idSearchResult") as Text).setText((oEvent.getSource() as SearchField).getValue())
    }

    public onKeepFocusInputChange(oEvent: InputBase$ChangeEvent): void {
        ;(this.getView()!.byId("idKeepFocusResult") as Text).setText((oEvent.getSource() as InputBase).getValue())
    }

    public onClearTextInputChange(oEvent: Input$LiveChangeEvent): void {
        console.log((oEvent.getSource() as Input).getValue())
        ;(this.getView()!.byId("idClearTextResult") as Text).setText((oEvent.getSource() as Input).getValue())
    }

    public onTest(oEvent: Button$PressEvent): void {
        this.onBoo(oEvent)
    }

    public onSelect(oEvent: CheckBox$SelectEvent): void {
        const selectedProperty = oEvent.getSource().getProperty("selected") as boolean
        const selectedParameter = oEvent.getParameter("selected")
        MessageToast.show(`selectedProperty: ${selectedProperty} selectedParameter: ${selectedParameter}`)
    }

    public scanBarcode(_oEvent: Button$PressEvent): void {
        const _self = this
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).cordova.plugins.barcodeScanner.scan(
            function (result: { scanCode: string; format: string; cancelled: boolean }) {
                // update in model
                ;(_self.getView()!.getModel("testModel") as JSONModel).setProperty("/barcode", result.scanCode)

                MessageToast.show(
                    "We got a barcode\n" +
                        "Result: " +
                        result.scanCode +
                        "\n" +
                        "Format: " +
                        result.format +
                        "\n" +
                        "Cancelled: " +
                        result.cancelled
                )
            },
            function (error: string) {
                MessageToast.show("Scanning failed: " + error)
            }
        )
    }

    public async openDialog(): Promise<void> {
        if (!this.dialog) {
            this.dialog = (await Fragment.load({ name: "test.Sample.view.Dialog", controller: this })) as Dialog
            this.dialog.setModel(this.getView()!.getModel("i18n"), "i18n")
        }
        this.dialog.open()
    }

    public close(): void {
        this.dialog!.close()
    }
}
