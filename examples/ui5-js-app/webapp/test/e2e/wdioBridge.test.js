const Main = require("./pageObjects/Main")

const selector = {
    selector: {
        id: "Title::NoAction.h1",
        viewName: "test.Sample.view.Main"
    }
}

describe("wdio bridge", () => {
    before(async () => {
        await Main.open()
    })
    it("test wdio function isDisplayed", async () => {
        const titleWUi5 = await browser.asControl(selector)
        const webElement = await titleWUi5.getWebElement()
        // old syntax
        expect(await webElement.isDisplayed()).toBeTruthy()
        // new wdio shortcut
        expect((await titleWUi5.$()).isDisplayed()).toBeTruthy()
        // new bridge
        expect(await titleWUi5.isDisplayed()).toBeTruthy()
    })

    it("test wdio function isLoading", async () => {
        const titleWUi5 = await browser.asControl(selector)
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

    it("test wdio function isClickable", async () => {
        const titleWUi5 = await browser.asControl(selector)
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
        expect(await browser.asControl(selector).isClickable()).toBeTruthy()
    })
})
