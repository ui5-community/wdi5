import BaseController from "./BaseController"
import MessageToast from "sap/m/MessageToast"
import StandardListItem from "sap/m/StandardListItem"
import Text from "sap/m/Text"
import List from "sap/m/List"
import ListBase from "sap/m/ListBase"
import { ListBase$ItemPressEvent } from "sap/m/ListBase"
import { CheckBox$SelectEvent } from "sap/m/CheckBox"
import { Button$PressEvent } from "sap/m/Button"

/**
 * @namespace test.Sample.controller
 */
export default class Other extends BaseController {
    public onInit(): void {}

    public onItemPress(oEvent: ListBase$ItemPressEvent): void {
        const key = oEvent.getParameter("listItem")!.data("key") as string
        ;(this.getView()!.byId("idTextFieldClickResult") as Text).setText(key)
        MessageToast.show(key)
    }

    public onSelect(oEvent: CheckBox$SelectEvent): void {
        const selectedProperty = oEvent.getSource().getProperty("selected") as boolean
        const selectedParameter = oEvent.getParameter("selected")
        MessageToast.show(`selectedProperty: ${selectedProperty} selectedParameter: ${selectedParameter}`)
    }

    public onAddLineItem(_oEvent: Button$PressEvent): void {
        ;(this.getView()!.byId("PeopleList") as List).addItem(
            new StandardListItem({
                title: "FirstName LastName",
                type: "Navigation"
            })
        )
    }
}
