const { wdi5 } = require("wdio-ui5-service")
const Page = require("./Page")

// const planningCalendarRow = {
//     selector: {
//         controlType: "sap.m.internal.PlanningCalendarRowListItem",
//         id: /__row0-__xmlview0--schedulePlanningCalendar-0-CLI$/
//     }
// }

class ComponentLocator extends Page {
    async open(path) {
        wdi5.goTo(path)
    }

    async open() {
        await super.open(`#/Calendar`)
    }

    async getShowButton() {
        const showSummary = {
            selector: {
                controlType: "sap.m.Button",
                id: /TodayBtn$/
            }
        }

        return await browser.asControl(showSummary)
    }

    async getCloseSummaryButton() {
        const closeSummary = {
            selector: {
                controlType: "sap.m.Button",
                id: /closeSummaryButton$/
            }
        }

        return await browser.asControl(closeSummary)
    }

    async getPlanningCalendar() {
        const planningCalendar = {
            selector: {
                controlType: "sap.m.PlanningCalendar",
                id: /PC1/
            }
        }

        return await browser.asControl(planningCalendar)
    }
}

module.exports = new ComponentLocator()
