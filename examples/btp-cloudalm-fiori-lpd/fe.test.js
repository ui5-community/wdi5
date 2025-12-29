import { wdi5 } from "wdio-ui5-service"

describe("FE basics", () => {
    let FioriElementsFacade
    before(async () => {
        wdi5.goTo("#testPlan-display")
        FioriElementsFacade = await browser.fe.initialize({
            onTheMainPage: {
                ListReport: {
                    appId: "com.sap.calm.imp.tm.planning",
                    componentId: "TestPlansList",
                    entitySet: "TestPlans"
                }
            },
            onTheDetailPage: {
                ObjectPage: {
                    appId: "com.sap.calm.imp.tm.planning",
                    componentId: "TestPlansObjectPage",
                    entitySet: "TestPlans"
                }
            },
            onTheShell: {
                Shell: {}
            }
        })
    })

    it.skip("should press tile", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            /* When.onTheShell.iGoToSection({ section: "AdditionalInfo" })
            When.onTheShell.iPressTile("#testPlan-display") */
            /* When.onTheShell.iNavigateViaMenu("Implementation")
            When.onTheShell.iPressTile("#testPlan-display") */
            // When.onTheShell.iCheckIntentBasedNavigation({ sSemanticObject: "testPlan", sAction: "display" })
            // Then.onTheMainPage.iSeeThisPage()
        })
    })

    it("should press table row", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            When.onTheMainPage.onFilterBar().iChangeFilterField("Project", "_ TPH S4H Cloud, public edition")
            //.and.iExecuteSearch()
            When.onTheMainPage.onTable().iPressRow(1)
            Then.onTheDetailPage.iSeeThisPage()
        })
    })

    it("should see an object page", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            Then.onTheDetailPage.onHeader().iCheckEdit({ visible: true }).and.iCheckTitle()
            When.onTheDetailPage.iGoToSection({ section: "AdditionalInfo" })
            Then.onTheDetailPage.iSeeThisPage()
        })
    })

    it("should navigate back to Shell page", async () => {
        await FioriElementsFacade.execute((Given, When, Then) => {
            When.onTheShell.iNavigateHome()
            // Then.onTheShell.iSeeThisPage()
        })
    })
})
