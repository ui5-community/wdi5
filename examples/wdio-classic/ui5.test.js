import { browser, expect } from "@wdio/globals"
import { mock } from "node:test"
import { wdi5 } from "wdio-ui5-service"

const logSpyInjectTools = mock.method(console, "log")

describe("ui5 basic", () => {
    after(() => {
        logSpyInjectTools.mock.restore()
    })

    it("should use the ESM style logger", () => {
        const logSpy = mock.method(console, "log", () => {})
        const Logger = wdi5.getLogger("esm!")
        Logger.log("Hello ESM World!")
        expect(logSpy.mock.calls[0].arguments[1]).toContain("esm!")
        logSpy.mock.restore()
    })

    it("window should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Browse Orders")
    })

    it("wdi5 should open and close a dialog", async () => {
        const selector1 = {
            selector: {
                id: "container-orderbrowser---master--filterButton",
                viewName: "sap.ui.demo.orderbrowser.view.Master"
            }
        }
        const button = await browser.asControl(selector1).press()
        const icon = await button.getIcon()
        expect(icon).toEqual("sap-icon://filter")

        const selector2 = {
            selector: {
                id: "container-orderbrowser---master--viewSettingsDialog-acceptbutton",
                searchOpenDialogs: true,
                interaction: {
                    idSuffix: "BDI-content"
                }
            }
        }
        const dialogButton = await browser.asControl(selector2)
        expect(dialogButton.isInitialized()).toBeTruthy()
        let isOpen = await dialogButton.isActive()
        expect(isOpen).toBeTruthy()
        await dialogButton.press()
        isOpen = await dialogButton.isActive()
        expect(isOpen).toBeFalsy()
    })

    it("wdi5 should search and return no results", async () => {
        const selector1 = {
            selector: {
                id: "container-orderbrowser---master--searchField"
            }
        }
        const search = await browser.asControl(selector1).enterText("NOTHING HERE").press()
        const text = await search.getValue()
        expect(text).toEqual("NOTHING HERE")

        const selector2 = {
            selector: {
                id: "container-orderbrowser---master--masterHeaderTitle"
            }
        }
        const headerTitle = await browser.asControl(selector2)
        const title = await headerTitle.getText()
        expect(title).toMatch("(0)")
    })

    it.only("should log warnings when browser is not running in BiDi mode", async () => {
        const messages = logSpyInjectTools.mock.calls.map((call) => call.arguments.flat()).flat()
        expect(browser.isBidi).toBeFalsy()
        expect(messages).toContain("WDI5 did not inject tools before starting.")
        expect(messages).toContain(
            "The 'browser.addInitScript' command is only supported when using WebDriver Bidi protocol."
        )
    })
})
