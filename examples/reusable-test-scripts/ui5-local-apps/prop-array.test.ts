import type MultiComboBox from "sap/m/MultiComboBox"
import Main from "./pageObjects/Main.js"

const multiComboBoxSelector = {
    forceSelect: true,
    selector: {
        interaction: "root" as const,
        id: "multiComboBox",
        viewName: "test.Sample.view.Main"
    }
}

describe("ui5 property array test", () => {
    before(async () => {
        await Main.open()
    })

    it("should get empty array", async () => {
        const oMultiComboBox = (await browser.asControl(multiComboBoxSelector)) as unknown as MultiComboBox
        const aSelectedKeys = await oMultiComboBox.getSelectedKeys()
        expect(aSelectedKeys.length).toEqual(0)
    })

    it("select two countries from list", async () => {
        const oMultiComboBox = (await browser.asControl(multiComboBoxSelector)) as unknown as MultiComboBox
        await oMultiComboBox.setSelectedKeys(["IN", "BR"])
        const aSelectedKeys = await oMultiComboBox.getSelectedKeys()
        expect(aSelectedKeys.length).toEqual(2)
    })

    it("get text from items list", async () => {
        const oMultiComboBox = (await browser.asControl(multiComboBoxSelector)) as unknown as MultiComboBox
        await oMultiComboBox.open()
        const items = await oMultiComboBox.getItems()
        // @ts-expect-error
        const firstItemText = await items[2].getTitle()
        expect(firstItemText).toEqual("Australia")
    })
})
