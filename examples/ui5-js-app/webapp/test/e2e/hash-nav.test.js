const { wdi5 } = require("wdio-ui5-service")

const listSelector = {
    selector: {
        id: "PeopleList",
        viewName: "test.Sample.view.Other"
    }
}

describe("hash-based nav", () => {
    it('should allow the deep entry to "Other" view using wdi5 helper class and the UI5 router', async () => {
        const oRouteOptions = {
            sComponentId: "container-Sample",
            sName: "RouteOther"
        }
        await wdi5.goTo("", oRouteOptions)

        const items = await browser.asControl(listSelector).getItems(true)
        expect(items.length).toEqual(9)
    })

    it("should navigate to Main view via #/", async () => {
        await wdi5.goTo("#/")

        const buttonSelector = {
            selector: {
                id: "NavFwdButton",
                viewName: "test.Sample.view.Main"
            }
        }

        expect(await (await browser.asControl(buttonSelector)).getProperty("visible")).toBeTruthy()
    })

    it("should navigate to Other view via sHash object parameter", async () => {
        await wdi5.goTo({ sHash: "#/Other" })

        const list = await browser.asControl(listSelector)
        expect(await list.getVisible()).toBeTruthy()
    })

    it('should allow the deep entry to "Other" view via the UI5 router directly', async () => {
        const oRouteOptions = {
            sComponentId: "container-Sample",
            sName: "RouteOther"
        }
        await browser.goTo({ oRoute: oRouteOptions })

        const list = await browser.asControl(listSelector)
        expect(await list.getVisible()).toBeTruthy()
    })
})
