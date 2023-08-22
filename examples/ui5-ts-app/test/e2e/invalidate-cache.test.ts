// only requiring the service for late inject/init
import Input from "sap/ui/webc/main/Input"
import { default as _wdi5 } from "wdio-ui5-service"
const wdi5 = new _wdi5()

describe("invalidate cache", () => {
    it("receives control and invalidates the cache after reloading the application", async () => {
        // stores the control in the cache
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

        // reload the app
        await browser.url("http://localhost:8080/index.html")
        // inject ui5 again which should invalidate the cache
        await wdi5.injectUI5()

        const webcomponentValueNew = await (
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

        expect(webcomponentValueNew).toEqual("Helvetius Nagy")
    })
})
