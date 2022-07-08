import { wdi5Selector } from "wdio-ui5-service/dist/types/wdi5.types"
import Page from "./Page"

class Other extends Page {
    async open() {
        await super.open(`#/Other`)
    }

    async getList(force = false) {
        const listSelector: wdi5Selector = {
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

export default new Other()
