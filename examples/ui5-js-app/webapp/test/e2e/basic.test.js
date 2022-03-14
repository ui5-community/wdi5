const Main = require("./pageObjects/Main")

describe("ui5 basic", () => {
    before(async () => {
        await Main.open()
    })

    it("should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Sample UI5 Application")
    })

    // #118
    it("should use a control selector with dots and colons", async () => {
        const selector = {
            selector: {
                id: "Title::NoAction.h1",
                viewName: "test.Sample.view.Main"
            }
        }

        // ui5
        const titleWUi5 = await browser.asControl(selector).getText()

        // working webdriver example with xpath id selector
        const titleElement = await $('//*[@id="container-Sample---Main--Title::NoAction.h1"]')
        const titleWwdio = await titleElement.getText()

        expect(titleWUi5).toEqual("UI5 demo")
        expect(titleWwdio).toEqual("UI5 demo")
    })

    it("check for invalid control selector", async () => {
        const selector1 = {
            selector_: {
                test: "some.test.string"
            }
        }

        const selector2 = {
            id: "some.test.string"
        }

        const invalidControl1 = await browser.asControl(selector1)
        const invalidControl2 = await browser.asControl(selector2)

        // check if result contains the expected validation error
        expect(invalidControl1).toContain("ERROR")
        expect(invalidControl2).toContain("ERROR")
    })

    it("test wdio function", async () => {
        const selector = {
            selector: {
                id: "Title::NoAction.h1",
                viewName: "test.Sample.view.Main"
            }
        }

        const titleWUi5 = await browser.asControl(selector)
        const webElement = await titleWUi5.getWebElement()
        // old syntax
        expect(await webElement.isDisplayed()).toBeTruthy()
        // new wdio shortcut
        expect((await titleWUi5.$()).isDisplayed()).toBeTruthy()
        // new bridge
        expect(await titleWUi5.isDisplayed()).toBeTruthy()
    })

    it("test wdio functions 2", async () => {
        const selector = {
            selector: {
                id: "Title::NoAction.h1",
                viewName: "test.Sample.view.Main"
            }
        }

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

    it("test wdio functions 3", async () => {
        const selector = {
            selector: {
                id: "Title::NoAction.h1",
                viewName: "test.Sample.view.Main"
            }
        }

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
    })

    it("test wdio functions 4", async () => {
        const selector = {
            selector: {
                id: "Title::NoAction.h1",
                viewName: "test.Sample.view.Main"
            }
        }

        expect(await browser.asControl(selector).isClickable()).toBeTruthy()
    })
})
