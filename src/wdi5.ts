import { Logger as _Logger } from "./lib/Logger"
const Logger = _Logger.getInstance()
export class wdi5 {
    static getLogger(sPrefix = "wdi5") {
        if (sPrefix === "wdi5") {
            return Logger
        } else {
            return _Logger.getInstance(sPrefix)
        }
    }

    static async goTo(param: any, oRoute) {
        if (param) {
            Logger.log(`Navigating to: ${JSON.stringify(param)}`)
            await browser.goTo(param)
        } else {
            Logger.log(`Navigating to: ${JSON.stringify(oRoute)}`)
            // ui5 router based navigation
            await browser.goTo({ oRoute })
        }
    }
}
