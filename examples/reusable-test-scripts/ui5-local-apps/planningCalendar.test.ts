import type ColumnListItem from "sap/m/ColumnListItem"
import type PlanningCalendar from "sap/m/PlanningCalendar"
import type PlanningCalendarRow from "sap/m/PlanningCalendarRow"
import CL from "./pageObjects/ComponentLocator.js"

describe("Planning Calendar test spec", () => {
    before(async () => {
        await CL.open()
    })

    it("should show aggreates of planning calendar", async () => {
        // I wait for a button to be clickable (which means that my app has loaded
        // const showBtn = await CL.getShowButton()
        // await browser.waitUntil(() => showBtn.$().isClickable())
        // I get the planning calendar
        const pc = (await CL.getPlanningCalendar()) as unknown as PlanningCalendar
        // I get aggregated rows
        const rows = (await pc.getRows()) as unknown as ColumnListItem[]
        // each people has a row

        const cells0 = (await rows[0].getCells()) as unknown as PlanningCalendarRow[]

        // The first two rows have two cell which are the the reminders and the appointments, third row does not have reminders!
        // This will log a lot of expected errors. It tries to load all calendar entries.
        // All entries which are not visible are not in dom -> throws error when tried to retrieve
        const appointments0 = await cells0[1].getAppointments()

        expect(appointments0.length).toBeGreaterThan(4) // four appointments visible on the selected date, but 22 in total

        // every first appointment is a meeting
        // the first three appointment are in the past and not visible -> not in DOM -> see error logs
        const appointments0Text = await appointments0[3].getTitle()
        expect(appointments0Text).toContain("Meet Max Mustermann")

        const cells1 = (await rows[1].getCells()) as unknown as PlanningCalendarRow
        // the first two rows have two cell which are the the reminders and the appointments, third row does not have reminders!
        const appointments1 = await cells1[1].getAppointments()
        expect(appointments1.length).toBeGreaterThan(4) // three appointments visible on the selected date, but 11 in total

        // every first appointment is a meeting
        // the first three appointment are in the past and not visible -> not in DOM -> see error logs
        const appointments1Text = await appointments1[3].getTitle()
        expect(appointments1Text).toContain("Team meeting")

        // test in all rows
        for (const row of rows) {
            // @ts-expect-error
            const rowInfo = await row.getControlInfo()
            expect(rowInfo.className).toBe("sap.m.internal.PlanningCalendarRowListItem")
        }
    })
})
