import Text from "sap/m/Text"
import List from "sap/ui/webc/main/List"
import StandardListItem from "sap/ui/webc/main/StandardListItem"
import BaseController from "./BaseController"

/**
 * @namespace test.Sample.tsapp.controller
 */
export default class Main extends BaseController {
    onItemClick(oEvent): void {
        ;(this.getView().byId("idTextFieldClickResult") as Text).setText(
            (oEvent.getParameter("item") as StandardListItem).getText()
        )
    }

    onAddLineItem(/* oEvent */): void {
        ;(this.getView().byId("PeopleList") as List).addItem(new StandardListItem({ text: "Peter Parker" }))
    }
}
