const { wdi5 } = require("wdio-ui5-service")

describe("FE basics", () => {
    let FioriElementsFacade
    before(async () => {
        await wdi5.goTo("#fe-lrop-v4")
        FioriElementsFacade = await browser.fe.initialize({
            onTheMainPage: {
                ListReport: {
                    appId: "sap.fe.demo.incidents",
                    componentId: "IncidentsList",
                    entitySet: "Incidents"
                }
            }
        })
    })

    it("should trigger search on ListReport page", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            Given.onTheMainPage.onFilterBar().iExecuteSearch()
            Then.onTheMainPage.onTable().iCheckRows(12)
        })
    })
})
