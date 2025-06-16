import { mock } from "node:test"
import { wdi5 } from "wdio-ui5-service"

describe("ui5 basic", () => {
    it("should use the ESM style logger", () => {
        const logSpy = mock.method(console, "log", () => {})
        const Logger = wdi5.getLogger("esm!")
        Logger.log("Hello ESM World!")
        expect(logSpy.mock.calls[0].arguments[1]).toContain("esm!")
        logSpy.mock.restore()
    })

    it("window should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Sample UI5 Application")
    })

    it("wdi5 should use a control selector with dots and colons", async () => {
        const selector = {
            selector: {
                id: "Title::NoAction.h1",
                viewName: "test.Sample.view.Main"
            }
        }
        const text = await /** @type {import("wdio-ui5-service/esm/lib/wdi5-control.js").WDI5Control} */ (
            await browser.asControl(selector)
        ).getText()
        expect(text).toEqual("UI5 demo")
    })
})
