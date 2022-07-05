import { Logger } from "./lib/Logger"
export class wdi5 {
    static getLogger(sPrefix = "wdi5") {
        return Logger.getInstance(sPrefix)
    }

    /**
     * navigate to a route/view of a UI5 app - by string hash
     *
     * @param param hash-part of the URL, e.g. "#/accounts/create"
     * @param browserInstance the currently remote controlled browser
     */
    static async goTo(oRoute: any, browserInstance?: WebdriverIO.Browser)
    /**
     * navigate to a route/view of a UI5 app - by router object
     *
     * @param oRoute a UI5 router object, e.g. {sHash:"#/accounts/create"}
     * @param browserInstance the currently remote controlled browser
     */
    static async goTo(param: string, browserInstance?: WebdriverIO.Browser)
    /**
     * @deprecated please use single parameter as nav option and optionally a browser instance
     */
    static async goTo(param: any, oRoute: any, browserInstance?: WebdriverIO.Browser)
    static async goTo(byWhat, oRoute: any, browserInstance: WebdriverIO.Browser = browser) {
        if (oRoute) {
            Logger.getInstance().warn(
                "deprecated signature: please use single parameter as nav option and optionally a browser instance"
            )
            byWhat = oRoute
        }
        if (typeof byWhat === "string") {
            Logger.getInstance().log(`Navigating via string hash: ${byWhat}`)
            await browserInstance.goTo(byWhat)
        } else if (typeof byWhat === "object" && byWhat.sHash) {
            Logger.getInstance().log(`Navigating via sHash: ${JSON.stringify(byWhat)}`)
            await browserInstance.goTo(byWhat)
        } else if (typeof byWhat === "object") {
            Logger.getInstance().log(`Navigating via oRoute: ${JSON.stringify(byWhat)}`)
            await browserInstance.goTo({ oRoute: byWhat })
        } else {
            Logger.getInstance().log(`Navigating via generic object: ${JSON.stringify(byWhat)}`)
            await browserInstance.goTo({ byWhat })
        }
    }
}
