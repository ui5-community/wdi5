describe("FE basics", () => {
    let FioriElementsFacade
    before(async () => {
        FioriElementsFacade = await browser.fe.initialize({
            // TODO: Set ListReport and ObjectPage details
            onTheMainPage: {
                ListReport: {
                    appId: "the-app-id",
                    componentId: "the-component-id-listreport",
                    entitySet: "the-entity-set"
                }
            },
            onTheDetailPage: {
                ObjectPage: {
                    appId: "the-app-id",
                    componentId: "the-component-id-objectpage",
                    entitySet: "the-entity-set"
                }
            },
            onTheShell: {
                Shell: {}
            }
        })
    })

    it("should press table row", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            Given.onTheMainPage.onFilterBar().iExecuteSearch()
            When.onTheMainPage.onTable().iPressRow(1)
        })
    })

    it("should see an object page", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            Then.onTheDetailPage.onHeader().iCheckEdit().and.iCheckTitle()
        })
    })

    it("should navigate back to Shell page", async () => {
        await FioriElementsFacade.toShell()
        await FioriElementsFacade.execute((Given, When, Then) => {
            When.onTheShell.iNavigateHome()
        })
    })
})
