import { Logger as _Logger } from "./lib/Logger"
const Logger = _Logger.getInstance()
export class wdi5 {
    static getLogger() {
        return Logger
    }

    static async goTo(hash, oRoute) {
        if (hash) {
            Logger.log(`Navigating to: ${hash}`)
            // used for electron and browser
            await browser.goTo(hash)

            // electron needs to have the wdi5 injected after navigation
            // -- no more as of Nov 2020 :) TODO: investigate why we don't need it
            // if (this.getConfig('platform') === 'electron') {
            // this.context.injectUI5(browser);
            // }
        } else {
            Logger.log(`Navigating to: ${oRoute.sName}`)

            // only for ui5 router based navigation use this function
            await browser.goTo({ oRoute: oRoute })
        }
    }
}
