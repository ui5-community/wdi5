sap.ui.define(
    [
        "test/Sample/controller/BaseController",
        "sap/m/MessageToast",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/Fragment"
    ],
    (Controller, MessageToast, JSONModel, Fragment) => {
        return Controller.extend("test.Sample.controller.Main", {
            onInit() {
                this.getOwnerComponent().getModel().read("/Customers('TRAIH')")

                const jData = {
                    inputValue: "test Input Value !!!",
                    buttonText: "Don't press me !!! -> binded",
                    checkbox: false,
                    barcode: ""
                }
                // TODO:
                // searchValue: "search Value"

                let testModel = new JSONModel(jData)
                this.getView().setModel(testModel, "testModel")

                this.initCombobox()
            },

            initCombobox: function () {
                // set explored app's demo model on this sample
                var oModel = new JSONModel()
                oModel.loadData("model/countries.json")
                this.getView().setModel(oModel, "Countries")
            },

            navFwd() {
                return this.getOwnerComponent().getRouter().navTo("RouteOther")
            },

            onPress(oEvent) {
                MessageToast.show(`${oEvent.getSource().getId()} pressed`)
            },
            onBoo(oEvent) {
                MessageToast.show(`👻`)
            },

            onTest(oEvent) {
                this.onBoo(oEvent)
            },
            onSelect(oEvent) {
                const selectedProperty = oEvent.getSource().getProperty("selected")
                const selectedParameter = oEvent.getParameter("selected")
                MessageToast.show(`selectedProperty: ${selectedProperty} selectedParameter: ${selectedParameter}`)
            },
            scanBarcode(oEvent) {
                var _self = this
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        // update in model
                        _self.getView().getModel("testModel").setProperty("/barcode", result.scanCode)

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
                    function (error) {
                        MessageToast.show("Scanning failed: " + error)
                    }
                )
            },

            async openDialog() {
                if (!this.dialog) {
                    this.dialog = await Fragment.load({ name: "test.Sample.view.Dialog", controller: this })
                    this.dialog.setModel(this.getView().getModel("i18n"), "i18n")
                }
                this.dialog.open()
            },

            close() {
                this.dialog.close()
            }
        })
    }
)
