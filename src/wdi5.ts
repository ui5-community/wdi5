import { Logger } from "./lib/Logger"
export class wdi5 {
    static getLogger(sPrefix = "wdi5") {
        return Logger.getInstance(sPrefix)
    }

    static async goTo(param: any, oRoute) {
        if (param) {
            Logger.getInstance().log(`Navigating to: ${JSON.stringify(param)}`)
            await browser.goTo(param)
        } else {
            Logger.getInstance().log(`Navigating to: ${JSON.stringify(oRoute)}`)
            // ui5 router based navigation
            await browser.goTo({ oRoute })
        }
    }
}
