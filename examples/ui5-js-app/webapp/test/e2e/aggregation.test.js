const { wdi5 } = require("wdio-ui5-service")

const Other = require("./pageObjects/Other")

describe("ui5 aggregation retrieval", () => {
    before(async () => {
        await Other.open()
    })

    beforeEach(async () => {
        browser.screenshot("aggregation")
    })

    it("select controls of a sap.m.Page's content aggregation", async () => {
        // goal: assert that .getContent() and .getAggregation("items") work the same
        // including access via the fluent async api
        const pageSelector = {
            selector: {
                id: "OtherPage",
                viewName: Other._viewName,
                interaction: "root"
            }
        }
        const page = await browser.asControl(pageSelector)

        // shorthand getContent()
        const content = await page.getContent()
        expect(content.length).toBe(3)

        // shorthand getContent($atIndex)
        const firstContentItem = await page.getContent(0)
        const listId = await firstContentItem.getId()
        const secondContentItem = await page.getContent(1)
        const vboxId = await secondContentItem.getId()
        expect(listId).toContain("PeopleList")
        expect(vboxId).toContain("VBoxx")

        // regular getAggregation($name)
        const aggregation = await page.getAggregation("content")
        expect(aggregation.length).toBe(3)

        const listIdViaAggregationItem = await aggregation[0].getId()
        const vboxIdViaAggregationItem = await aggregation[1].getId()
        expect(listIdViaAggregationItem).toContain("PeopleList")
        expect(vboxIdViaAggregationItem).toContain("VBoxx")

        // test shorthand with fluent async api
        const listIdViaFluentApi = await browser.asControl(pageSelector).getContent(0).getId()
        expect(listIdViaFluentApi).toContain("PeopleList")
        const vboxItemsViaFluentApi = await browser.asControl(pageSelector).getContent(1).getItems()
        expect(vboxItemsViaFluentApi.length).toBe(3)
    })

    it("get list aggregation and validate items", async () => {
        // action:
        // get the aggreagation -> returns array of WDI5 controls
        const items = await Other.getListItems()

        // assertions:
        // check all items are bound
        expect(items.length).toEqual(9)
        // loop though controls and validate entries (bound in the app view "Other")
        for (const listItem of items) {
            await expect(
                Other.allNames.find(async (name) => (await listItem.getProperty("title")) === name)
            ).toBeTruthy()
        }
    })

    it('validate getProperty("title") and getTitle() are equivalent', async () => {
        const items = await Other.getListItems()
        for (const listItem of items) {
            expect(await listItem.getProperty("title")).toEqual(await listItem.getTitle())
        }
    })

    it('should successfully retrieve aggregation w/ and w/o "forceSelect" set', async () => {
        const items = await Other.getListItems()
        const itemsCached = await Other.getListItems()
        const itemsRehydrated = await Other.getListItems(true)
        expect(items.length).toBe(itemsCached.length)
        expect(items.length).toBe(itemsRehydrated.length)

        // expectation is that all wdi5 elements from cache
        // equal those of the original selected ones
        // but not the ones with the "forceSelect: true" option set
        items.forEach((item, i) => {
            expect(item).toEqual(itemsCached[i])
            expect(item).not.toEqual(itemsRehydrated[i])
        })
    })

    it('add LineItem and verify via "forceSelect" it exists in list', async () => {
        // get items and save length before adding new item
        const itemsOld = await Other.getListItems()

        // button which executes a function to add an additional line item
        const addLineItemButton = await Other.getAddLineItemButtom()
        await addLineItemButton.firePress()

        // after the added line item retrieve the list again
        const itemsOldRehydrated = await Other.getListItems()

        // expect the list to be up-to-date
        expect(itemsOld.length + 1).toEqual(itemsOldRehydrated.length)

        // also retrieve list with forceSelect option
        const itemsRehydrated = await Other.getListItems(true)

        // extract the last item of list
        const lastItemOfOldReference = itemsOldRehydrated[itemsOldRehydrated.length - 1]
        const lastItemOfRehydratedList = itemsRehydrated[itemsRehydrated.length - 1]

        // verify "forceSelect"
        expect(lastItemOfOldReference).not.toEqual(lastItemOfRehydratedList)
    })
})
