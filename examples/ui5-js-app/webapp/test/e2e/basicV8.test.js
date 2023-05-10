import wdi5 from "wdio-ui5-service"

describe("ui5 basic", () => {
    before(async () => {
        await wdi5.goTo(`#/Main`)
    })

    it("should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Sample UI5 Application")
    })

    it("should use a control selector with dots and colons (wdi5)", async () => {
        const selector = {
            selector: {
                id: "Title::NoAction.h1",
                viewName: "test.Sample.view.Main"
            }
        }

        const titleWUi5 = await browser.asControl(selector).getText()
        expect(titleWUi5).toEqual("UI5 demo")
    })
})
