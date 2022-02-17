const { wdi5 } = require("wdio-ui5-service")
const Main = require("./pageObjects/Main")

describe("ui5 checkbox test", () => {
    before(async () => {
        await Main.open()
    })

    it("should check the checkbox", async () => {
        const cb = await Main.getCheckbox()
        await cb.setSelected(true)
        expect(await cb.getProperty("selected")).toBeTruthy
    })
    it("should uncheck the checkbox", async () => {
        const cb = await Main.getCheckbox()
        await cb.setSelected(false)
        expect(await cb.getProperty("selected")).toBeFalsy()
    })

    it("should uncheck the checkbox via wdio-native .click()", async () => {
        const ui5checkBox2 = await Main.getCheckbox()

        // wdio-alternative to ui5 native api
        // retrieve the wdio element from the ui5 control via .getWebElement()
        const $wdioCheckBox2 = await ui5checkBox2.getWebElement()
        $wdioCheckBox2.click()
        wdi5.getLogger().log(
            "ui5checkBox2.getProperty('selected') returned: " + (await ui5checkBox2.getProperty("selected"))
        )

        expect(await ui5checkBox2.getProperty("selected")).toBeTruthy()
    })
})
