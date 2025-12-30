describe("ui5 basic", () => {
    it("should go to Implementation tab", async () => {
        const selector1 = {
            selector: {
                controlType: "sap.m.IconTabFilter",
                viewName: "sap.ushell.components.shell.MenuBar.view.MenuBar",
                properties: {
                    text: "Implementation"
                },
                interaction: {
                    idSuffix: "text"
                }
            }
        }
        const el = await browser.asControl(selector1)
        expect(el.$().isDisplayed()).toBeTruthy()
        await el.press()
    })

    it("should go to Test Plans app", async () => {
        const selector1 = {
            selector: {
                controlType: "sap.m.GenericTile",
                properties: {
                    header: "Test Plans"
                },
                interaction: {
                    idSuffix: "hdrContent"
                }
            }
        }
        const el = await browser.asControl(selector1)
        expect(el.$().isDisplayed()).toBeTruthy()
        await el.press()
    })

    it("should see the app", async () => {
        const selector1 = {
            selector: {
                id: "com.sap.calm.imp.tm.planning::TestPlansList--fe::table::TestPlans::LineItem-title",
                interaction: {
                    idSuffix: "inner"
                }
            }
        }

        const el = await browser.asControl(selector1)
        expect(el.$().isDisplayed()).toBeTruthy()
    })
})
