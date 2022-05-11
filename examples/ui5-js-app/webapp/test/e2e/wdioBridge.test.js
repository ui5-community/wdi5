const Main = require("./pageObjects/Main")
const { wdi5 } = require("wdio-ui5-service")

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

    it("test wdio function isDisplayed", async () => {
        const titleWUi5 = await browser.asControl(titleSelector)
        const webElement = await titleWUi5.getWebElement()
        // old syntax
        expect(await webElement.isDisplayed()).toBeTruthy()
        // new wdio shortcut
        expect((await titleWUi5.$()).isDisplayed()).toBeTruthy()
    })

    it("test wdio function isLoading", async () => {
        const titleWUi5 = await browser.asControl(titleSelector)
        const webElement = await titleWUi5.getWebElement()
        const result = await webElement.isLoading()
        // old syntax
        expect(result).toBeFalsy()
        // new wdio shortcut
        const shortResult = titleWUi5.$()
        expect(await shortResult.isLoading()).toBeFalsy()
    })

    it("test wdio function isClickable", async () => {
        const titleWUi5 = await browser.asControl(iaSyncSelector)
        const webElement = await titleWUi5.getWebElement()
        const result = await webElement.isClickable()
        // old syntax
        expect(result).toBeTruthy()
        // new wdio shortcut
        expect(titleWUi5.$().isClickable()).toBeTruthy()

        // fluent api
        expect(await browser.asControl(iaSyncSelector).$().isClickable()).toBeTruthy()
    })

    it("test wdio fluent api getLocation", async () => {
        // old not fluent
        const wdioLocation = await (await browser.asControl(iaSyncSelector).getWebElement()).getLocation()
        // new fluent version of webelement access
        const wdioBridgeLocationFluent = await browser.asControl(iaSyncSelector).$().getLocation()

        wdi5.getLogger().log(`[WDI5]: wdioLocation: ${wdioLocation.x}, ${wdioLocation.y}`)
        wdi5.getLogger().log(
            `[WDI5]: wdioBridgeLocationFluent: ${wdioBridgeLocationFluent.x}, ${wdioBridgeLocationFluent.y}`
        )

        expect(wdioLocation).toEqual(wdioBridgeLocationFluent)
    })
})
