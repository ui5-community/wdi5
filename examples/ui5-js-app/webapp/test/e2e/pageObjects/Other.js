const Page = require("./Page")

class Other extends Page {
    allNames = [
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
    _viewName = "test.Sample.view.Other"

    async open() {
        await super.open(`#/Other`)
    }

    async getList(force = false) {
        const listSelector = {
            wdio_ui5_key: "PeopleList",
            selector: {
                id: "PeopleList",
                viewName: this._viewName
            },
            forceSelect: force //> this will populate down to $ui5Control.getAggregation and $ui5Control.getProperty as well
        }

        return await browser.asControl(listSelector)
    }

    async getListItems(force = false) {
        const list = await this.getList(force)
        return await list.getAggregation("items")
    }

    async getAddLineItemButtom() {
        return await browser.asControl({
            selector: {
                id: "idAddLineItemButton",
                viewName: this._viewName
            }
        })
    }
}

module.exports = new Other()
