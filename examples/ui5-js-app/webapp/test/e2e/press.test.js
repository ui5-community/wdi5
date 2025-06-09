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

        const startDate = new Date()
        await dateTime.setValue(startDate.toJSON()) // set the current date as initial value

        // legacy only - don't use .fireEvent(...) in actual tests!
        const element = await browser.asControl({
            selector: {
                id: "container-Sample---Main--idDateTime-icon"
            }
        })
        await element.fireEvent("press")

        startDate.setDate(startDate.getDate() + 1) // add one day to the start date
        const tomorrowSuffix = startDate.toJSON().substring(0, 10).replaceAll("-", "")
        // TODO: it's not changing the value, it finds/clicks on the item, but doesn't select it
        await browser
            .asControl({
                selector: {
                    id: "container-Sample---Main--idDateTime-cal--Month0",
                    searchOpenDialogs: true,
                    interaction: {
                        idSuffix: tomorrowSuffix
                    }
                }
            })
            .press()

        const okButton = await browser.asControl({
            selector: {
                id: "container-Sample---Main--idDateTime-OK",
                searchOpenDialogs: true,
                interaction: {
                    idSuffix: "BDI-content"
                }
            }
        })
        // TODO: test value changing via element interaction
        expect(okButton._generatedUI5Methods).toBeTruthy()
    })
})
