const marky = require("marky")

const Other = require("./pageObjects/Other")

describe("ui5 aggregation retrieval", () => {
    before(async () => {
        await Other.open()
    })

    beforeEach(async () => {
        browser.screenshot("aggregation")
    })

    it("check the getBinding of a table", async () => {
        const mytable = await Other.getList()
        const firstrow = await mytable.getItems(0)
        const rowcontext = await firstrow.getBindingContext()
        const myobject = await rowcontext.getObject()

        expect(myobject.FirstName).toEqual("Nancy")
    })

    it.only("compare new w/ existing asControl", async () => {
        const pageSelector = {
            forceSelect: true,
            selector: {
                id: "OtherPage",
                viewName: Other._viewName,
                interaction: "root"
            }
        }
        // warm up
        await browser.asControl(pageSelector)

        // fluent async api measurement
        marky.mark("old asControl")
        const existingAsControl = await browser.asControl(pageSelector).getContent(1).getItems()
        expect(existingAsControl.length).toBe(3)
        const oldFluentAsyncApi = marky.stop("old asControl")

        marky.mark("new asControl")
        const pageSelector2 = { ...pageSelector, newAsControl: true, fluent: true }
        const newAsControl = await browser.asControl(pageSelector2).getContent()[1].getItems()
        expect(newAsControl.length).toBe(3) // <-- fails currently as relaying browser-scope result is not working properly
        const newFluentAsyncApi = marky.stop("new asControl")

        expect(newFluentAsyncApi.duration).toBeLessThan(oldFluentAsyncApi.duration)

        // plain .asControl() measurement
        marky.mark("old only asControl")
        const existingAsControl2 = await browser.asControl(pageSelector)
        expect(existingAsControl2.isInitialized()).toBeTruthy()
        const oldAsControlOnly = marky.stop("old only asControl")

        marky.mark("new only asControl")
        const pageSelector3 = { ...pageSelector, newAsControl: true }
        const newAsControl2 = await browser.asControl(pageSelector3)
        expect(newAsControl2.isInitialized()).toBeTruthy() // <-- fails currently as newAsControl2 == proxy
        const newAsControlOnly = marky.stop("new only asControl")

        expect(newAsControlOnly.duration).toBeLessThan(oldAsControlOnly.duration)

        // // to test: property access
        // const pageSelector4 = { ...pageSelector, newAsControl: true, fluent: true }
        // await browser.asControl(pageSelector4).getContent()[0].getItems().sId

        // const bla = await browser.asControl(pageSelector3)
        // const result = bla.getContent()[0].getItems().sId
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
        // get the aggreagation -> returns array of wdi5 controls
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
