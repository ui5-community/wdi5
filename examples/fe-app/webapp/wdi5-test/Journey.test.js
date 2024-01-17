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

    it("should work with method execution and property selection", async () => {
        await FioriElementsFacade.execute((Given, When) => {
            Given.onTheMainPage.onFilterBar().iExecuteSearch()
            When.onTheMainPage.onTable().iPressRow({ identifier: "inc_0002" })
        })
        const textcontroll = await browser.asControl({
            selector: {
                controlType: "sap.m.Text",
                viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                viewId: "sap.fe.demo.incidents::IncidentsObjectPage",
                bindingPath: {
                    path: "/Incidents(ID=919f1a94-0281-4226-ad3a-9148af4cb5d2,IsActiveEntity=true)",
                    propertyPath: "identifier"
                }
            }
        })
        const text1 = await browser
            .asControl({
                selector: {
                    controlType: "sap.m.Text",
                    viewName: "sap.fe.templates.ObjectPage.ObjectPage",
                    viewId: "sap.fe.demo.incidents::IncidentsObjectPage",
                    bindingPath: {
                        path: "/Incidents(ID=919f1a94-0281-4226-ad3a-9148af4cb5d2,IsActiveEntity=true)",
                        propertyPath: "identifier"
                    }
                }
            })
            .getBindingContext()
            .getObject().incidentStatus.name
        expect(text1).toBe("New")
        const bindingContext = await textcontroll.getBindingContext()

        const text2 = (await (await bindingContext.getObject()).incidentStatus).name
        expect(text2).toBe("New")

        const bindingContext2 = await browser.asObject(bindingContext.getUUID())
        const text3 = (await (await bindingContext2.getObject()).incidentStatus).name
        expect(text3).toBe("New")

        const text4 = await bindingContext2.getProperty("incidentStatus/name")
        expect(text4).toBe("New")

        const model = await bindingContext.getModel()
        const bindings = await model.aAllBindings
        const zero = await bindings[0]
        const updateGroup1 = await zero.sUpdateGroupId

        expect(updateGroup1).toBe("$auto")

        const updateGroup2 = await browser.asObject(bindingContext.getUUID()).getModel().aAllBindings[0].sUpdateGroupId
        expect(updateGroup2).toBe("$auto")
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
