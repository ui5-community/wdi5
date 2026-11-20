import Page from "./Page.js"

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

    async getPage() {
        return await browser.asControl({
            selector: {
                id: "OtherPage",
                viewName: this._viewName
            }
        })
    }

    async getList(force = false) {
        return await browser.asControl({
            wdio_ui5_key: "PeopleList",
            forceSelect: force,
            selector: {
                id: "PeopleList",
                viewName: this._viewName
            }
        })
    }

    async getListItems(force = false) {
        const list = await this.getList(force)
        return await list.getAggregation("items")
    }

    async getTextFieldClickResult() {
        return await browser.asControl({
            selector: {
                id: "idTextFieldClickResult",
                viewName: this._viewName
            }
        })
    }

    async getAddLineItemButton() {
        return await browser.asControl({
            selector: {
                id: "idAddLineItemButton",
                viewName: this._viewName
            }
        })
    }

    // keep typo'd name for backward compatibility with existing tests
    async getAddLineItemButtom() {
        return await this.getAddLineItemButton()
    }

    async getPeopleListSelect() {
        return await browser.asControl({
            selector: {
                id: "PeopleListSelect",
                viewName: this._viewName
            }
        })
    }

    async getPeopleListSelectItems(force = false) {
        const list = await this.getPeopleListSelect()
        return await list.getAggregation("items")
    }

    async getAllCheckboxes(force = false) {
        return await browser.allControls({
            forceSelect: force,
            selector: {
                controlType: "sap.m.CheckBox",
                viewName: this._viewName
            }
        })
    }
}

export default new Other()
