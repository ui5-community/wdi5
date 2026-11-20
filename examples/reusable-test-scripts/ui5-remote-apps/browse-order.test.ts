import type Button from "sap/m/Button"
import type SearchField from "sap/m/SearchField"
import type Title from "sap/m/Title"
import type UIArea from "sap/ui/core/UIArea"
import { wdi5 } from "wdio-ui5-service"

describe("ui5 basic", () => {
    it("should be either ESM or CJS", () => {
        try {
            // It's CJS
            expect(__filename).toContain("cjs")
        } catch (err) {
            // It's ESM
            expect(err.toString()).toContain("ReferenceError: __filename is not defined")
        }
    })

    it("should be Webdriver Classic or BiDi", () => {
        const isClassic = !!browser.options?.capabilities["wdio:enforceWebDriverClassic"]
        // If it's Webdriver Classic, isBiDi has to be false
        expect(!isClassic).toBe(!!browser?.isBidi)
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
        const button = await browser.asControl(selector1)
        await button.press()
        const icon = await (button as unknown as Button).getIcon()
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
        let isOpen = await (dialogButton as unknown as UIArea).isActive()
        expect(isOpen).toBeTruthy()
        await dialogButton.press()
        isOpen = await (dialogButton as unknown as UIArea).isActive()
        expect(isOpen).toBeFalsy()
    })

    it("wdi5 should navigate to not found then nav to root # main page again", async () => {
        await wdi5.goTo("#wdi5ShouldBeNotFound")
        const selector1 = {
            selector: {
                controlType: "sap.m.Title",
                viewName: "sap.ui.demo.orderbrowser.view.NotFound"
            }
        }
        const title = await browser.asControl(selector1)
        const text = await (title as unknown as Title).getText()
        expect(text).toBeTruthy()

        await wdi5.goTo("#")
        const selector2 = {
            selector: {
                id: "container-orderbrowser---master--filterButton",
                viewName: "sap.ui.demo.orderbrowser.view.Master"
            }
        }
        const button = await browser.asControl(selector2)
        const icon = await (button as unknown as Button).getIcon()
        expect(icon).toEqual("sap-icon://filter")
    })

    it("wdi5 should search and return no results", async () => {
        const selector1 = {
            selector: {
                id: "container-orderbrowser---master--searchField"
            }
        }
        // @ts-expect-error: expected error in fluent api
        const search = await browser.asControl(selector1).enterText("NOTHING HERE").press()
        const text = await (search as unknown as SearchField).getValue()
        expect(text).toEqual("NOTHING HERE")

        const selector2 = {
            selector: {
                id: "container-orderbrowser---master--masterHeaderTitle"
            }
        }
        const headerTitle = (await browser.asControl(selector2)) as Title
        const title = await headerTitle.getText()
        expect(title).toMatch("(0)")
    })
})
