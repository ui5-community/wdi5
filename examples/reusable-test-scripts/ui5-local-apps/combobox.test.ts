import type ComboBox from "sap/m/ComboBox"
import Main from "./pageObjects/Main.js"

const oComboboxSelector = {
    forceSelect: true,
    selector: {
        interaction: "root" as const,
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
        const combobox = (await browser.asControl(oComboboxSelector)) as unknown as ComboBox

        // no need to open the combobox
        const items = await combobox.getItems()
        expect(items.length).toEqual(8)
    })

    it("get combobox single item aggregation as ui5 items", async () => {
        const combobox = (await browser.asControl(oComboboxSelector)) as unknown as ComboBox
        // another issue with the combobox. If the Box was not opend prevoiusly the items are not rendered -> unretrieveable with ui5
        await combobox.open()

        const items = await combobox.getItems()
        // @ts-expect-error
        expect(await items[4].getTitle()).toEqual("Bahrain")
    })

    it("get combobox items aggregation as ui5 items", async () => {
        const combobox = (await browser.asControl(oComboboxSelector)) as unknown as ComboBox
        // another issue with the combobox. If the Box was not opend prevoiusly the items are not rendered -> unretrieveable with ui5
        await combobox.open()

        const items = await combobox.getItems()
        // @ts-expect-error
        expect(await items[4].getTitle()).toEqual("Bahrain")
    })
})
