import { browser } from "@wdio/globals"
import { wdi5 } from "wdio-ui5-service"

describe("ui5 basic", () => {
    it("should get the UI5 version from the CLI arguments", async () => {
        const ui5VersionArgument = process.argv.find((argument) => argument.includes("--ui5=")).split("=")[1]
        const ui5VersionBrowser = await browser.getUI5Version()
        const logger = wdi5.getLogger()
        logger.log(`Browser URL: ${await browser.getUrl()}`)
        logger.log(`UI5 version running in the browser: ${ui5VersionBrowser}`)
        logger.log(`UI5 version set via CLI arguments: ${ui5VersionArgument}`)
        expect(ui5VersionBrowser).toContain(ui5VersionArgument)
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
})
