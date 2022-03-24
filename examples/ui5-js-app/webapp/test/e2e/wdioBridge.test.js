const { it } = require("mocha")
const { Logger } = require("../../../../../dist/lib/Logger")
const Main = require("./pageObjects/Main")

const titleSelector = {
    selector: {
        id: "Title::NoAction.h1",
        viewName: "test.Sample.view.Main"
    }
}
const iaSyncSelector = {
    selector: {
        id: "idIaSync",
        viewName: "test.Sample.view.Main"
    }
}

describe("wdio bridge", () => {
    before(async () => {
        await Main.open()
    })

    // skipped in favour of the (separated) test
    it.skip("test wdio function isDisplayed", async () => {
        const titleWUi5 = await browser.asControl(titleSelector)
        const webElement = await titleWUi5.getWebElement()
        // old syntax
        expect(await webElement.isDisplayed()).toBeTruthy()
        // new wdio shortcut
        expect((await titleWUi5.$()).isDisplayed()).toBeTruthy()
        // new bridge
        expect(await titleWUi5.isDisplayed()).toBeTruthy()
    })

    // skipped in favour of the (separated) test
    it.skip("test wdio function isLoading", async () => {
        const titleWUi5 = await browser.asControl(titleSelector)
        const webElement = await titleWUi5.getWebElement()
        const result = await webElement.isLoading()
        // old syntax
        expect(result).toBeFalsy()
        // new wdio shortcut
        const shortResult = await titleWUi5.$()
        expect(await shortResult.isLoading()).toBeFalsy()
        // new bridge
        expect(await titleWUi5.isLoading()).toBeFalsy()
    })

    // skipped in favour of the (separated) test
    it.skip("test wdio function isClickable", async () => {
        const titleWUi5 = await browser.asControl(iaSyncSelector)
        const webElement = await titleWUi5.getWebElement()
        const result = await webElement.isClickable()
        // old syntax
        expect(result).toBeTruthy()
        // new wdio shortcut
        expect((await titleWUi5.$()).isClickable()).toBeTruthy()
        // new bridge
        const resultBridge = await titleWUi5.isClickable()
        expect(resultBridge).toBeTruthy()

        // fluent api
        expect(await browser.asControl(iaSyncSelector).isClickable()).toBeTruthy()
    })

    // skipped in favour of the (separated) test
    it.skip("test wdio fluent api getLocation", async () => {
        const button = await browser.asControl(iaSyncSelector)

        const wdioLocation = await (await button.getWebElement()).getLocation()
        const wdioBridgeLocation = await button.getLocation()

        const wdioLocationFluent = await browser.asControl(iaSyncSelector).getLocation()
        const wdioBridgeLocationFluent = await browser.asControl(iaSyncSelector).getWebElement().getLocation()

        console.log(`[WDI5]: wdioLocation: ${wdioLocation.x}, ${wdioLocation.y}`)
        console.log(`[WDI5]: wdioBridgeLocation: ${wdioBridgeLocation.x}, ${wdioBridgeLocation.y}`)
        console.log(`[WDI5]: wdioLocationFluent: ${wdioLocationFluent.x}, ${wdioLocationFluent.y}`)
        console.log(`[WDI5]: wdioBridgeLocationFluent: ${wdioBridgeLocationFluent.x}, ${wdioBridgeLocationFluent.y}`)

        expect(wdioLocation).toEqual(wdioBridgeLocation)
        expect(wdioLocationFluent).toEqual(wdioBridgeLocationFluent)
    })

    it("test wdio fluent api getLocation (separated)", async () => {
        // old not fluent
        const wdioLocation = await (await browser.asControl(iaSyncSelector).getWebElement()).getLocation()
        // new fluent version of webelement access
        const wdioBridgeLocationFluent = await browser.asControl(iaSyncSelector).$().getLocation()

        console.log(`[WDI5]: wdioLocation: ${wdioLocation.x}, ${wdioLocation.y}`)
        console.log(`[WDI5]: wdioBridgeLocationFluent: ${wdioBridgeLocationFluent.x}, ${wdioBridgeLocationFluent.y}`)

        expect(wdioLocation).toEqual(wdioBridgeLocationFluent)
    })
})
