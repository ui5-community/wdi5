const Main = require("./pageObjects/Main")

const oComboboxSelector = {
    forceSelect: true,
    selector: {
        interaction: "root",
        id: "combobox",
        viewName: "test.Sample.view.Main"
    }
}

// #121
describe("ui5 sap.m.Combobox", () => {
    before(async () => {
        await Main.open()
    })

    it("get combobox items aggregation as WebdriverIO representations", async () => {
        const combobox = await browser.asControl(oComboboxSelector)

        // no need to open the combobox
        const items = await combobox.getItems(true)
        expect(items.length).toEqual(8)
    })

    it("get combobox single item aggregation as ui5 items", async () => {
        const combobox = await browser.asControl(oComboboxSelector)
        // another issue with the combobox. If the Box was not opend prevoiusly the items are not rendered -> unretrieveable with ui5
        await combobox.open()

        const items = await combobox.getItems(4)
        expect(await items.getTitle()).toEqual("Bahrain")
    })

    it("get combobox items aggregation as ui5 items", async () => {
        const combobox = await browser.asControl(oComboboxSelector)
        // another issue with the combobox. If the Box was not opend prevoiusly the items are not rendered -> unretrieveable with ui5
        await combobox.open()

        const items = await combobox.getItems()
        expect(await items[4].getTitle()).toEqual("Bahrain")
    })
})
