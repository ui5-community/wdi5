const { wdi5 } = require("wdio-ui5-service")
const Other = require("./pageObjects/Other")

describe("list interaction", () => {
    const buttonSelector = {
        selector: {
            id: "NavFwdButton",
            viewName: "test.Sample.view.Main"
        }
    }

    const listSelector = {
        selector: {
            id: "PeopleList",
            viewName: "test.Sample.view.Other"
        }
    }

    before(async () => {
        await Other.open()
    })

    beforeEach(async () => {
        await browser.screenshot("list-interaction-before")
    })

    afterEach(async () => {
        await browser.screenshot("list-interaction-after")
    })

    it("should have the correct list header", async () => {
        const list = await browser.asControl(listSelector)
        expect(await list.getProperty("headerText")).toEqual("...bites the dust!")
    })

    it("press a list item to show its' data:key property", async () => {
        // fire click event on a list item
        // it will set the list items' data:key value to the text field
        // the event handler function checks the data:key property of the list item -> manually add this property to the event.
        const list = await browser.asControl(listSelector)
        await list.fireEvent("itemPress", {
            eval: () => {
                return {
                    listItem: {
                        data: () => {
                            return "Mock Name"
                        }
                    }
                }
            }
        })

        const textFieldSelector = {
            selector: {
                id: "idTextFieldClickResult",
                viewName: "test.Sample.view.Other"
            }
        }

        const mockedListItemPress = await browser.asControl(textFieldSelector)

        expect(await mockedListItemPress.getText()).toEqual("Mock Name")
    })
})
