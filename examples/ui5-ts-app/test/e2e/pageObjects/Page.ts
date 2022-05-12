import { Selector } from "../selector"

export default class Page {
    open = () => {
        super.open(`#/Other`)
    }

    async getList(force = false) {
        const listSelector: Selector = {
            selector: {
                id: "PeopleList",
                viewName: "test.sample.view.Other"
            },
            forceSelect: force
        }
        return await browser.asControl(listSelector)
    }
}
