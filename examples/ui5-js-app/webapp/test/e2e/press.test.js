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
        await button.fireEvent("press")
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

    it("press() with 'idSuffix'", async () => {
        const dateTime = await browser.asControl({
            selector: {
                id: "idDateTime",
                viewName: "test.Sample.view.Main"
            }
        })

        await dateTime.setValue("2024-05-01-12-00-00")

        // legacy only - don't use .fireEvent(...) in actual tests!
        const element = await browser.asControl({
            selector: {
                id: "container-Sample---Main--idDateTime-icon"
            }
        })
        await element.fireEvent("press")

        await browser
            .asControl({
                selector: {
                    id: "container-Sample---Main--idDateTime-cal--Month0",
                    searchOpenDialogs: true,
                    interaction: {
                        idSuffix: "20240511"
                    }
                }
            })
            .press()

        await browser
            .asControl({
                selector: {
                    id: "container-Sample---Main--idDateTime-OK",
                    searchOpenDialogs: true,
                    interaction: {
                        idSuffix: "BDI-content"
                    }
                }
            })
            .press()

        const value = await dateTime.getValue()
        expect(value).toEqual("2024-05-11-12-00-00")
    })
})
