import BaseController from "./BaseController"
import MessageToast from "sap/m/MessageToast"
import StandardListItem from "sap/m/StandardListItem"

/**
 * @namespace test.Sample.tsapp.controller
 */
export default class Main extends BaseController {
    onItemPress(oEvent): void {
        ;(this.getView().byId("idTextFieldClickResult") as any).setText(oEvent.getParameter("listItem").data("key")) //TODO: check type

        MessageToast.show(oEvent.getParameter("listItem").data("key"))
    }

    onAddLineItem(oEvent): void {
        ;(this.getView().byId("PeopleList") as any).addItem(
            //TODO: check Type
            new StandardListItem({
                title: "Peter Parker",
                type: "Navigation"
            })
        )
    }
}
