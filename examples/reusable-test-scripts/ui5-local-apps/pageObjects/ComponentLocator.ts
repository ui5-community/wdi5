import { wdi5 } from "wdio-ui5-service"
import Page from "./Page.js"

class ComponentLocator extends Page {
    _viewName = "test.Sample.view.Calendar"

    async open() {
        await super.open(`#/Calendar`)
    }

    async getPlanningCalendar() {
        return await browser.asControl({
            selector: {
                controlType: "sap.m.PlanningCalendar",
                id: /PC1/
            }
        })
    }

    async getTodayButton() {
        return await browser.asControl({
            selector: {
                controlType: "sap.m.Button",
                id: /TodayBtn$/
            }
        })
    }

    async getCloseSummaryButton() {
        return await browser.asControl({
            selector: {
                controlType: "sap.m.Button",
                id: /closeSummaryButton$/
            }
        })
    }

    async getViewsMultiComboBox() {
        return await browser.asControl({
            selector: {
                controlType: "sap.m.MultiComboBox",
                viewName: this._viewName
            }
        })
    }
}

export default new ComponentLocator()
