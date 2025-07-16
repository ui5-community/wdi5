const { mock } = require("node:test")
const { wdi5 } = require("wdio-ui5-service")

describe("ui5 basic", () => {
    it("should use the CJS style logger", () => {
        const logSpy = mock.method(console, "log", () => {})
        const Logger = wdi5.getLogger("cjs!")
        Logger.log("Hello CJS World!")
        expect(logSpy.mock.calls[0].arguments[1]).toContain("cjs!")
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
        const dialogButton = await browser.asControl(selector2).press()
        expect(dialogButton.isInitialized()).toBeTruthy()
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
})
