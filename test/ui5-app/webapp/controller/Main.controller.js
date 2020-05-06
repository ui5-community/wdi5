sap.ui.define([
    "test/Sample/controller/BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], function (Controller, MessageToast, JSONModel) {
    "use strict"

    return Controller.extend("test.Sample.controller.Main", {
        onInit: function () {
            this.getOwnerComponent().getModel().read("/Customers('TRAIH')")

            const jData = {
                inputValue: "test Input Value !!!",
                buttonText: "Don't press me !!! -> binded"
            };

            let testModel = new JSONModel(jData)
            this.getView().setModel(testModel, "testModel");
        },

        navFwd: function () {
            return this.getOwnerComponent().getRouter().navTo("RouteOther")
        },

        onPress: function (oEvent) {
            MessageToast.show(`${oEvent.getSource().getId()} pressed`)
        },
        onBoo: function (oEvent) {
            MessageToast.show(`👻`)
        },

        onTest: function (oEvent) {
            this.onBoo(oEvent)
        }
    })
})
