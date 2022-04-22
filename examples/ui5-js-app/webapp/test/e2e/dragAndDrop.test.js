const { wdi5 } = require("wdio-ui5-service")
const Other = require("./pageObjects/Other")
var dragAndDrop = require("html-dnd").codeForSelectors

describe("list drag and drop", () => {
    const listSelector = {
        forceSelect: true,
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

    it("should change the order of the list", async () => {
        const elem = await browser.asControl(listSelector).getItems(2).getWebElement()
        const target = await browser.asControl(listSelector).getItems(8).getWebElement()

        // wdio -> not working see https://github.com/webdriverio/webdriverio/issues/4134
        // also donw forget to comment wdi5 dragAndDrop method before testing
        // #1. drag and drop to other element
        // await elem.dragAndDrop(target)

        // #2. drag and drop relative from current position
        // await elem.dragAndDrop({ x: 10, y: 300 })

        const listItemsInNewOrder = await browser.asControl(listSelector).getItems(7)
        const listItemTitle = await listItemsInNewOrder.getTitle()

        expect(listItemTitle).toEqual("Robert King")
    })
})
