const Main = require("./pageObjects/Main")

const selector = {
    wdio_ui5_key: "allButtons",
    selector: {
        controlType: "sap.m.Button",
        viewName: "test.Sample.view.Main"
    }
}

describe("ui5 basic, get all buttons", () => {
    before(async () => {
        await Main.open()
    })

    it("check number of buttons", async () => {
        const buttons = await browser.allControls(selector)
        // 7 buttons in view and the panel expand button => 8
        expect(buttons.length).toEqual(8)
    })

    it("no force select", async () => {
        const buttons = await browser.allControls(selector)
        expect(await buttons[0].getText()).toEqual("to Other view")
    })

    it("with force select", async () => {
        const selectorWForce = selector
        selectorWForce.forceSelect = true

        const buttons = await browser.allControls(selectorWForce)
        expect(await buttons[0].getText()).toEqual("to Other view")
    })

    it("reuse the cached wdi5 controls", async () => {
        const buttons = await browser.allControls(selector)
        expect(await buttons[0].getText()).toEqual("to Other view")
    })

    it("test webelement", async () => {
        const buttons = await browser.allControls(selector)
        const webButton = await buttons[0].getWebElement()
        expect(webButton).toBeTruthy()
    })
})
