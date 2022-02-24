const { wdi5 } = require("wdio-ui5-service")
const Main = require("./pageObjects/Main")

describe("ui5 basic", () => {
    globalThis.viewName = "test.Sample.view.Main"

    before(async () => {
        await Main.open()
    })

    it("should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Sample UI5 Application")
    })
})
