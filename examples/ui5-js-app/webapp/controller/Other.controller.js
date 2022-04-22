sap.ui.define(
    ["test/Sample/controller/BaseController", "sap/m/MessageToast", "sap/m/StandardListItem"],
    function (Controller, MessageToast, StandardListItem) {
        "use strict"

        return Controller.extend("test.Sample.controller.Other", {
            onInit: function () {},

            onItemPress(oEvent) {
                this.getView().byId("idTextFieldClickResult").setText(oEvent.getParameter("listItem").data("key"))

                MessageToast.show(oEvent.getParameter("listItem").data("key"))
            },

            onDragDrop: function (oEvent) {
                const oDraggedItem = oEvent.getParameter("draggedControl")
                const oDroppedItem = oEvent.getParameter("droppedControl")
                const oPeopleList = this.getView().byId("PeopleList")
                const iDroppedItemIndex = oPeopleList.indexOfItem(oDroppedItem)

                list.removeItem(oDraggedItem)
                list.insertItem(oDraggedItem, iDroppedItemIndex)
            },

            onAddLineItem(oEvent) {
                this.getView()
                    .byId("PeopleList")
                    .addItem(
                        new StandardListItem({
                            title: "FirstName LastName",
                            type: "Navigation"
                        })
                    )
            }
        })
    }
)
