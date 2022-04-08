const Main = require("./pageObjects/Main")

const multiComboBoxSelector = {
    forceSelect: true,
    selector: {
        interaction: "root",
        id: "multiComboBox",
        viewName: "test.Sample.view.Main"
    }
}

describe("ui5 property array test", () => {
    before(async () => {
        await Main.open()
    })

    it("should get empty array", async () => {
        const oMultiComboBox = await browser.asControl(multiComboBoxSelector)
        const aSelectedKeys = await oMultiComboBox.getSelectedKeys()
        expect(aSelectedKeys.length).toEqual(0)
    })

    it("select two countries from list", async () => {
        const oMultiComboBox = await browser.asControl(multiComboBoxSelector)
        await oMultiComboBox.setSelectedKeys(["IN", "BR"])
        const aSelectedKeys = await oMultiComboBox.getSelectedKeys()
        expect(aSelectedKeys.length).toEqual(2)
    })
})
