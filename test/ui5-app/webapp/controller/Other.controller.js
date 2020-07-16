sap.ui.define(["test/Sample/controller/BaseController", 'sap/m/MessageToast'], function (Controller, MessageToast) {
    "use strict"

    return Controller.extend("test.Sample.controller.Other", {
        onInit: function () { },

        onItemPress(oEvent) {

            this.getView().byId("idTextFieldClickResult").setText(oEvent.getParameter("listItem").data("key"))

            MessageToast.show(oEvent.getParameter("listItem").data("key"));
        }
    })
})
