sap.ui.define(["test/Sample/controller/BaseController", "sap/m/MessageToast"], function (Controller, MessageToast) {
    "use strict"

    return Controller.extend("test.Sample.controller.Main", {
        onInit: function () {
            this.getOwnerComponent().getModel().read("/Customers('TRAIH')")
        },

        navFwd: function () {
            return this.getOwnerComponent().getRouter().navTo("RouteOther")
        },

        onPress: function (oEvent) {
            MessageToast.show(`${oEvent.getSource().getId()} pressed`)
        },
        onBoo: function (oEvent) {
            MessageToast.show(`👻`)
        }
    })
})
