const Main = require("./pageObjects/Main")

describe("custom wdi5 press event", async () => {
    const openButtonSelector = {
        forceSelect: true, // make sure we're retrieving from scratch
        selector: {
            id: "openDialogButton",
            viewName: "test.Sample.view.Main"
        }
    }

    const dialogSelector = {
        forceSelect: true,
        selector: {
            id: "Dialog",
            controlType: "sap.m.Dialog",
            interaction: "root"
        }
    }

    before(async () => {
        await Main.open()
    })

    afterEach(async () => {
        await browser.keys("Escape")
    })

    it("wdi5 press() in step-by-step", async () => {
        const button = await browser.asControl(openButtonSelector)
        await button.press()
        const popup = await browser.asControl(dialogSelector)
        await expect(await popup.getVisible()).toBeTruthy()
    })

    it("wdi5 press() in fluent async api", async () => {
        await browser.asControl(openButtonSelector).press()
        const popup = await browser.asControl(dialogSelector)
        await expect(await popup.getVisible()).toBeTruthy()
    })

    it("wdio click() via getWebElement", async () => {
        const $button = await browser.asControl(openButtonSelector).getWebElement()
        await $button.click()
        const popup = await browser.asControl(dialogSelector)
        await expect(await popup.getVisible()).toBeTruthy()
    })
})
