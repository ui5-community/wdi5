describe("FE basics", () => {
    let FioriElementsFacades
    before(async () => {
        FioriElementsFacades = await browser.fe.initialize({
            onTheMainPage: {
                ListReport: {
                    appId: "sap.fe.demo.incidents",
                    componentId: "IncidentsList",
                    entitySet: "Incidents"
                }
            },
            onTheDetailPage: {
                ObjectPage: {
                    appId: "sap.fe.demo.incidents",
                    componentId: "IncidentsObjectPage",
                    entitySet: "Incidents"
                }
            },
            onTheShell: {
                Shell: {}
            }
        })
    })

    it("should trigger search on ListReport page on browser one and two", async () => {
        await FioriElementsFacades.one.execute((Given, When, Then) => {
            Given.onTheMainPage.onFilterBar().iExecuteSearch()
            Then.onTheMainPage.onTable().iCheckRows(12)
            Then.onTheMainPage.onTable().iCheckRows({ identifier: "inc_0002", title: "Password Reset" })
            When.onTheMainPage.onTable().iPressRow({ identifier: "inc_0002" })
        })

        await FioriElementsFacades.two.execute((Given, When, Then) => {
            Given.onTheMainPage.onFilterBar().iExecuteSearch()
            Then.onTheMainPage.onTable().iCheckRows(12)
            Then.onTheMainPage.onTable().iCheckRows({ identifier: "inc_0002", title: "Password Reset" })
            When.onTheMainPage.onTable().iPressRow({ identifier: "inc_0002" })
        })
    })
})
