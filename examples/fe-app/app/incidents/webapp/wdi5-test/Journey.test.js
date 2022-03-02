const { wdi5 } = require("wdio-ui5-service")

describe("FE basics", () => {
    before(async () => {
        await wdi5.goTo("#fe-lrop-v4")
    })

    it("should trigger search on ListReport page", async () => {
        const FioriElementsFacade = await new browser.fe({
            ListReport: {
                appId: "sap.fe.demo.incidents",
                componentId: "IncidentsList",
                entitySet: "Incidents"
            }
        })
        const search = await FioriElementsFacade.onFilterBar().iExecuteSearch()
        const check = await FioriElementsFacade.onTable().iCheckRows()
        expect(search).toBe(true)
        expect(check).toBe(true)
    })
})
