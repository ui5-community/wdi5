const { wdi5 } = require("wdio-ui5-service")
const Other = require("./pageObjects/Other")

const listSelector = {
    // forceSelect: true,
    selector: {
        id: "PeopleList",
        viewName: "test.Sample.view.Other"
    }
}

const tests = [{ api: "asControl" }, { api: "_asControl" }]

describe("async api", () => {
    before(async () => {
        await Other.open()
    })

    for (const test of tests) {
        it(`api: browser.${test.api} - getItems(x) and getTitle() in sequence`, async () => {
            const list = await browser[test.api](listSelector)
            wdi5.getLogger().info("//> ********************")
            wdi5.getLogger().info("//> done with sap.m.List")
            const listItem = await list.getItems(1) // ui5 api
            wdi5.getLogger().info("//> ********************")
            wdi5.getLogger().info("//> done with List Item")
            const title = await listItem.getTitle() // ui5 api
            wdi5.getLogger().info("//> ********************")
            wdi5.getLogger().info("//> done with sap.m.Title")
            expect(title).toBe("Andrew Fuller")
        })
    }

    it("chain getItems(x) and getTitle()", async () => {
        const title = await browser.asControl(listSelector).getItems(1).getTitle()
        expect(title).toBe("Andrew Fuller")
    })

    it("chain events, setter and getter", async () => {
        const selector = {
            selector: {
                id: "idAddLineItemButton",
                viewName: "test.Sample.view.Other"
            }
        }
        const oldText = await browser.asControl(selector).press().getText()
        expect(oldText).toBe("add Line Item")
        const _newText = "changed!"
        const newText = await browser.asControl(selector).press().setText(_newText).getText()
        expect(newText).toBe(_newText)
    })
})
