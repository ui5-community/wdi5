describe("FE basics", () => {
    it("should trigger search on ListReport page", async () => {
        const FioriElementsFacade = await new browser.fe({
            ListReport: {
                appId: "sap.fe.demo.incidents",
                componentId: "IncidentsList",
                entitySet: "Incidents"
            }
        })
        await FioriElementsFacade.onFilterBar().iExecuteSearch()
    })
})
