import { browser } from "./types/browser-commands.types"

import { Logger as _Logger } from "./lib/Logger"
const Logger = _Logger.getInstance()
export class wdi5 {
    static getLogger() {
        return Logger
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
