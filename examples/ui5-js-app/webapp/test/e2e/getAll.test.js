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
        const buttons = await browser.asControls(selector)
        // 7 buttons in view and the panel expand button
        expect(buttons.length).toEqual(8)
    })

    it("no force select", async () => {
        const buttons = await browser.asControls(selector)
        expect(await buttons[0].getText()).toEqual("to Other view")
    })

    it("with force select", async () => {
        const selectorWForce = selector
        selectorWForce.forceSelect = true

        const buttons = await browser.asControls(selectorWForce)
        expect(await buttons[0].getText()).toEqual("to Other view")
    })

    it("reuse the cached wdi5 controls", async () => {
        const buttons = await browser.asControls(selector)
        expect(await buttons[0].getText()).toEqual("to Other view")
    })

    it("test isAttached, without init", async () => {
        const buttons = await browser.asControls(selector)
        expect(await buttons[0].isAttached()).toBeFalsy()
    })

    it("test webelement", async () => {
        const buttons = await browser.asControls(selector)
        const webButton = await buttons[0].getWebElement()
        expect(webButton).toBeTruthy()
    })

    it("init and test isAttached", async () => {
        const buttons = await browser.asControls(selector)
        await buttons[0].attach()
        expect(await buttons[0].isAttached()).toBeTruthy()
    })
})
