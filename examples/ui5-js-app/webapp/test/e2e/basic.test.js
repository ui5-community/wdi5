const Main = require("./pageObjects/Main")

const oComboboxSelector = {
    // forceSelect: true,
    controlType: "sap.m.ComboBox", // this invokes some internal special case hanlding to fir the ui5 Bug https://github.com/SAP/openui5/issues/3477
    selector: {
        interaction: "root",
        id: "combobox",
        viewName: "test.Sample.view.Main"
    }
}

describe("ui5 basic", () => {
    before(async () => {
        await Main.open()
    })

    it("should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Sample UI5 Application")
    })

    // #118
    it("should use a control selector with dots and colons", async () => {
        const selector = {
            selector: {
                id: "Title::NoAction.h1",
                viewName: "test.Sample.view.Main"
            }
        }

        // ui5
        const titleWUi5 = await browser.asControl(selector).getText()

        // working webdriver example with xpath id selector
        const titleElement = await $('//*[@id="container-Sample---Main--Title::NoAction.h1"]')
        const titleWwdio = await titleElement.getText()

        expect(titleWUi5).toEqual("UI5 demo")
        expect(titleWwdio).toEqual("UI5 demo")
    })

    it("check for invalid control selector", async () => {
        const selector1 = {
            selector_: {
                test: "some.test.string"
            }
        }

        const selector2 = {
            id: "some.test.string"
        }

        const invalidControl1 = await browser.asControl(selector1)
        const invalidControl2 = await browser.asControl(selector2)

        // check if result contains the expected validation error
        expect(invalidControl1).toContain("ERROR")
        expect(invalidControl2).toContain("ERROR")
    })

    // #121
    it("get combox items aggregation as WebdriverIO representations", async () => {
        const combobox = await browser.asControl(oComboboxSelector)

        const items = await combobox.getItems(true)
        expect(items.length).toEqual(70)
    })

    // #121
    it("get combox items aggregation as WebdriverIO representations", async () => {
        const combobox = await browser.asControl(oComboboxSelector)
        // another issue with the combobox. If the Box was not opend prevoiusly the items are not rendered -> unretrieveable with ui5
        await combobox.open()

        const items = await combobox.getItems(4)
        expect(await items.getTitle()).toEqual("Bahrain")
    })
})
