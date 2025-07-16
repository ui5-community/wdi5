describe("FE basics", () => {
    let FioriElementsFacade
    before(async () => {
        FioriElementsFacade = await browser.fe.initialize({
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

    it("should trigger search on ListReport page", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            Given.onTheMainPage.onFilterBar().iExecuteSearch()
            Then.onTheMainPage.onTable().iCheckRows(12)
            Then.onTheMainPage.onTable().iCheckRows({ identifier: "inc_0002", title: "Password Reset" })
            When.onTheMainPage.onTable().iPressRow({ identifier: "inc_0002" })
        })
    })

    it("should see an object page", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            Then.onTheDetailPage.onHeader().iCheckEdit().and.iCheckTitle("Password Reset")
            When.onTheDetailPage.onHeader().iExecuteEdit()
            Then.onTheDetailPage.iSeeThisPage().and.iSeeObjectPageInEditMode()
            When.onTheDetailPage
                .onForm({ section: "IncidentOverviewFacet" })
                .iChangeField({ property: "title" }, "Password obliteration")
            Then.onTheDetailPage.onFooter().iCheckDraftStateSaved()
            When.onTheDetailPage.onFooter().iExecuteSave()
        })
    })

    it("should see an object page", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            When.onTheShell.iNavigateBack()
            Then.onTheMainPage.iSeeThisPage()
            Given.onTheMainPage.onFilterBar().iExecuteSearch()
            Then.onTheMainPage.onTable().iCheckRows({ identifier: "inc_0002", title: "Password obliteration" })
        })
    })
})
