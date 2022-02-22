// only requiring the service for late inject/init
const { default: _ui5Service } = require("wdio-ui5-service")
const ui5Service = new _ui5Service()

describe("ui5 basic", () => {
    it('should show a non UI5 page, then advance to a UI5 page and late init "wdi5"', async () => {
        // native wdio functionality - navigates to the wdi5 github page
        await browser.$("#user-content-wdi5-").waitForDisplayed()
        // open local app
        await browser.url("http://localhost:8888")
        // do the late injection
        await ui5Service.injectUI5()
    })

    // after late injection, use wdi5 as usual
    it("should get a button text via model binding", async () => {
        const buttonText = await browser
            .asControl({
                selector: {
                    bindingPath: {
                        modelName: "testModel",
                        propertyPath: "/buttonText"
                    },
                    viewName: "test.Sample.view.Main",
                    controlType: "sap.m.Button"
                }
            })
            .getText()

        expect(buttonText).toContain("press me")
    })
})
