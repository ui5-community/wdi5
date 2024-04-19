// only requiring the service for late inject/init
import Input from "sap/ui/webc/main/Input"
import { default as _wdi5 } from "wdio-ui5-service"
const wdi5 = new _wdi5()

describe("late inject wdi5", () => {
    it('should show a non UI5 page, then advance to a UI5 page and late init "wdi5"', async () => {
        // native wdio functionality - navigates to the wdi5 github page
        await browser.$("#user-content-wdi5-").waitForExist()
        // open local app
        await browser.url("http://localhost:8080/index.html")
        // do the late injection
        await wdi5.injectUI5()
    })

    it("should verify the caching of the wdi5 config", async () => {
        // open local app
        await browser.url("http://localhost:8080/index.html")
        // do the late injection
        await wdi5.injectUI5()
        // check if config have been cached properly
        expect(__wdi5Config.wdi5.waitForUI5Timeout).toBe(654321)
    })

    it("wdi5 should subsequently work with UI5 enablement", async () => {
        const webcomponentValue = await (
            browser.asControl({
                selector: {
                    bindingPath: {
                        modelName: "",
                        propertyPath: "/Customers('TRAIH')/ContactName"
                    },
                    viewName: "test.Sample.tsapp.view.Main",
                    controlType: "sap.ui.webc.main.Input"
                }
            }) as unknown as Input
        ).getValue()

        expect(webcomponentValue).toEqual("Helvetius Nagy")
    })
})
