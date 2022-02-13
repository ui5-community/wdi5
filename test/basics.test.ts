import Button from "sap/m/Button"
import { wdi5Selector } from "../src/types/wdi5.types"

describe("basics", async () => {
    it("should open a UI5-enabled site (here: DemoKit) supplied in wdio.conf's wdi5 setting", async () => {
        const title = await browser.getTitle()
        await expect(title).toEqual("OpenUI5 SDK - Demo Kit")
    })

    it.only("should find a ui5 control by id", async () => {
        const selectorDownloadButton: wdi5Selector = {
            selector: {
                id: "readMoreButton",
                controlType: "sap.m.Button",
                viewName: "sap.ui.documentation.sdk.view.Welcome"
            }
        }
        const controlDownloadButton: Button = await browser.asControl(selectorDownloadButton)
        const text = await controlDownloadButton.getText()
        expect(text).toEqual("Download")

        const textViaAsyncApi = await (browser.asControl(selectorDownloadButton) as unknown as Button).getText()
        expect(textViaAsyncApi).toEqual("Download")
    })
})
