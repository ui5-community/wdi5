import type List from "sap/m/List"
import type StandardListItem from "sap/m/StandardListItem"
import { wdi5 } from "wdio-ui5-service"
import Other from "./pageObjects/Other.js"

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
            const list: List = await browser[test.api](listSelector)
            wdi5.getLogger().info("//> ********************")
            wdi5.getLogger().info("//> done with sap.m.List")
            // @ts-expect-error
            const listItem: StandardListItem = await list.getItems(1) // ui5 api
            wdi5.getLogger().info("//> ********************")
            wdi5.getLogger().info("//> done with List Item")
            const title = await listItem.getTitle() // ui5 api
            wdi5.getLogger().info("//> ********************")
            wdi5.getLogger().info("//> done with sap.m.Title")
            expect(title).toBe("Andrew Fuller")
        })
    }

    it("chain getItems(x) and getTitle()", async () => {
        // @ts-expect-error
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
        // @ts-expect-error
        const oldText = await browser.asControl(selector).press().getText()
        expect(oldText).toBe("add Line Item")
        const _newText = "changed!"
        // @ts-expect-error
        const newText = await browser.asControl(selector).press().setText(_newText).getText()
        expect(newText).toBe(_newText)
    })
})
