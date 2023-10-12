import { wdi5 } from "wdio-ui5-service"
describe("drive in Work Zone with standard wdi5/wdio APIs", () => {
    it("should click the avatar button in the workzone shell", async () => {
        await wdi5.toWorkZoneShell()
        await browser
            .asControl<sap.m.Avatar>({
                selector: {
                    id: "userActionsMenuHeaderButton"
                }
            })
            .press()
        const popover = await browser.asControl<sap.m.Popover>({
            selector: {
                id: "sapUshellUserActionsMenuPopover",
                controlType: "sap.m.Popover",
                interaction: "root"
            }
        })

        expect(await popover.isOpen()).toBeTruthy()
    })

    it("should find the table in the travel app", async () => {
        await wdi5.toWorkZoneApp()
        const table = await browser.asControl<sap.ui.mdc.Table>({
            selector: {
                id: "sap.fe.cap.travel::TravelList--fe::table::Travel::LineItem"
            }
        })
        const actions = await table.getActions(true)
        expect(actions.length).toBeGreaterThanOrEqual(1)
    })
})
