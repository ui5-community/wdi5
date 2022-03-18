const Main = require("./pageObjects/Main")
const _viewName = "test.Sample.view.Main"

describe("ui5 interaction-controls", () => {
    before(async () => {
        await Main.open()
    })

    it("check for Searchfield Properties", async () => {
        const searchFieldSelector = {
            selector: {
                // id: "idSearchfield",
                viewName: _viewName,
                interactable: true,
                visible: true,
                controlType: "sap.m.SearchField"
            }
        }

        expect(await browser.asControl(searchFieldSelector).getValue()).toEqual("search Value")
    })

    it.only("clear Searchfield", async () => {
        const searchFieldSelector = {
            forceSelect: true,
            selector: {
                id: /.*idSearchfield/g,
                // controlType: "sap.m.SearchField",
                viewName: _viewName
            }
        }

        const searchFieldSearchSelector = {
            selector: {
                // id: /.*idSearchfield-search/g,
                controlType: "sap.m.SearchField",
                interactionType: "PRESS",
                viewName: _viewName
            }
        }

        const searchFieldResetSelector = {
            selector: {
                // id: /.*idSearchfield/g,
                controlType: "sap.m.SearchField",
                interactionType: "PRESS",
                viewName: _viewName
            }
        }

        let searchField = await browser.asControl(searchFieldSelector)
        const oOptions = {
            interactionType: "PRESS"
        }
        await searchField.interactWithControl(oOptions)

        // reset
        const resetButton = await browser.asControl(searchFieldResetSelector)
        resetButton.firePress()

        searchField = await browser.asControl(searchFieldSelector)
        expect(await searchField.getValue()).toEqual("")

        // search on magnifier
        searchField.setValue("new Search")
        const searchFieldSearchControl = await browser.asControl(searchFieldSearchSelector)
        searchFieldSearchControl.firePress()

        // search on enter
        searchField.enterText("new Value 2")
        searchField.search()
    })
})
