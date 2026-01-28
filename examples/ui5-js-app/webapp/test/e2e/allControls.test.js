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
        // 8 buttons in view and the panel expand button => 8
        expect(buttons.length).toEqual(9)
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

    it("press() with interaction selector on specific control from allControls", async () => {
        // This test verifies the fix for the issue where press() with interaction selector
        // always pressed the first control instead of the specific one
        const buttonSelector = {
            forceSelect: true,
            selector: {
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main",
                interaction: "press"
            }
        }

        const buttons = await browser.allControls(buttonSelector)
        expect(buttons.length).toBeGreaterThan(1)

        // Get the text of the second button before pressing
        const secondButtonText = await buttons[1].getText()
        expect(secondButtonText).toBeTruthy()

        // Press the second button using the interaction selector
        // This should NOT press the first button
        await buttons[1].press()

        // Verify we didn't navigate (which would happen if first button was pressed)
        // The first button is "to Other view" which navigates away
        const currentHash = await browser.getUrl()
        // If the fix works correctly, we should still be on the main view
        // because we pressed a different button, not the navigation one
        expect(currentHash).toContain("Main")
    })
})
