import { Selector } from "../selector"
import Page from "./Page"

const allNames = [
    "Nancy Davolio",
    "Andrew Fuller",
    "Janet Leverling",
    "Margaret Peacock",
    "Steven Buchanan",
    "Michael Suyama",
    "Robert King",
    "Laura Callahan",
    "Anne Dodsworth"
]
export class Other extends Page {
    async open() {
        await super.open(`#/Other`)
    }

    async getList(force = false) {
        const listSelector: Selector = {
            selector: {
                id: "PeopleList",
                viewName: "test.Sample.tsapp.view.Other"
            },
            forceSelect: force //> this will populate down to $ui5Control.getAggregation and $ui5Control.getProperty as well
        }

        return await browser.asControl(listSelector)
    }

    async getListItems(force = false) {
        const list = await this.getList(force)
        return await list.getAggregation("items")
    }
}
