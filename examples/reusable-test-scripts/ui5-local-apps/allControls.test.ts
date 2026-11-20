import type Button from "sap/m/Button"
import Main from "./pageObjects/Main.js"

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
        // 8 buttons in view and the panel expand button => 8
        expect(buttons.length).toEqual(9)
    })

    it("no force select", async () => {
        const buttons = (await browser.allControls(selector)) as unknown as Button[]
        expect(await buttons[0].getText()).toEqual("to Other view")
    })

    it("with force select", async () => {
        const selectorWForce = selector
        // @ts-expect-error
        selectorWForce.forceSelect = true

        const buttons = (await browser.allControls(selectorWForce)) as unknown as Button[]
        expect(await buttons[0].getText()).toEqual("to Other view")
    })

    it("reuse the cached wdi5 controls", async () => {
        const buttons = (await browser.allControls(selector)) as unknown as Button[]
        expect(await buttons[0].getText()).toEqual("to Other view")
    })

    it("test webelement", async () => {
        const buttons = await browser.allControls(selector)
        const webButton = await buttons[0].getWebElement()
        expect(webButton).toBeTruthy()
    })
})
