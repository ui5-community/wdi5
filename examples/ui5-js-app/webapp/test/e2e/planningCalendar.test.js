const CL = require("./pageObjects/ComponentLocator")

describe("Planning Canedar test spec", () => {
    before(async () => {
        await CL.open()
    })

    it("should show aggreates of planning calendar", async () => {
        // I wait for a button to be clickable (which means that my app has loaded
        const showBtn = await CL.getShowButton()
        await browser.waitUntil(() => showBtn.$().isClickable())
        // I get the planning calendar
        const pc = await CL.getPlanningCalendar()
        // console.log("PC ", pc);
        // I get aggregated rows
        const rows = await pc.getRows()
        for (const row of rows) {
            const cells = await row.getCells()
            const appointments = await cells[1].getAppointments()
            expect(appointments.length).toBeGreaterThan(4)

            // every first appointment is a meeting
            const appointmentText = await appointments[0].getTitle()
            expect(appointmentText).toContain("Meet")

            const rowInfo = await row.getControlInfo()
            expect(rowInfo.className).toBe("sap.m.internal.PlanningCalendarRowListItem")
        }
    })
})
