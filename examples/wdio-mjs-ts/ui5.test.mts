import { wdi5 } from "wdio-ui5-service"

describe("ui5 basic", () => {
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

    it("wdi5 should navigate to not found then nav to root # main page again", async () => {
        await wdi5.goTo("#wdi5ShouldBeNotFound")
        const selector1 = {
            selector: {
                controlType: "sap.m.Title",
                viewName: "sap.ui.demo.orderbrowser.view.NotFound"
            }
        }
        const text = await browser.asControl(selector1).getText()
        expect(text).toBeTruthy()

        await wdi5.goTo("#")
        const selector2 = {
            selector: {
                id: "container-orderbrowser---master--filterButton",
                viewName: "sap.ui.demo.orderbrowser.view.Master"
            }
        }
        const icon = await browser.asControl(selector2).getIcon()
        expect(icon).toEqual("sap-icon://filter")
    })
})
