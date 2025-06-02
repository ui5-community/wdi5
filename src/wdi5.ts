import Authenticator from "./lib/authentication/Authenticator.js"
import { Logger } from "./lib/Logger.js"

const authenticatorInstances = {}

/**
 * a (static) helper class named after the tool
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class wdi5 {
    /**
     * get an instance of wdi5's logger for some pretty looking console output
     * @param sPrefix displayed within "[ ]" prepending the log message
     * @returns an instance of wdi5's logger
     */
    static getLogger(sPrefix = "wdi5") {
        return Logger.getInstance(sPrefix)
    }

    /**
     * set the browsing context for to the WorkZone _shell_
     *
     * so that all methods of the browser object will be executed in the context of the WorkZone shell
     */
    static async toWorkZoneShell() {
        await browser.switchToParentFrame()
        await browser.pause(100) // let the browsing context settle
    }

    /**
     * set the browsing context for to the WorkZone _app_
     *
     * so that all methods of the browser object will be executed in the context of the WorkZone app
     */
    static async toWorkZoneApp() {
        await browser.switchToFrame(0) // TODO: deprecated switchToFrame
        await browser.pause(100) // let the browsing context settle
    }

    //// REVISIT: not yet/if still needed :)
    // static wz = new Proxy(this, {
    //     get(target, prop, receiver) {
    //         browser.switchToParentFrame()

    //         // eslint-disable-next-line prefer-rest-params
    //         console.log("GET", ...arguments)
    //         Reflect.get(odatav4Lib, prop, receiver)

    //         browser.switchToFrame(0)
    //     }
    // })

    /**
     * expose the current authentication status
     *
     * @param browserInstanceName
     * @returns the current authentication status
     */
    static async isLoggedIn(browserInstanceName?: string): Promise<boolean> {
        let authenticatorInstance
        if (!browserInstanceName) {
            return new Authenticator().getIsLoggedIn()
        }

        if (!authenticatorInstances[browserInstanceName]) {
            authenticatorInstance = new Authenticator(browserInstanceName)
            authenticatorInstances[browserInstanceName] = authenticatorInstance
        } else {
            authenticatorInstance = authenticatorInstances[browserInstanceName]
        }
        return authenticatorInstance.getIsLoggedIn()
    }

    /**
     * navigate to a route/view of a UI5 app - by router object
     *
     * @param routerOption a UI5 router object, e.g. {
        sComponentId,
        sName,
        oParameters,
        oComponentTargetInfo,
        bReplace
    }
     * @param browserInstance the currently remote controlled browser
     */
    static async goTo(routerOption: any, browserInstance?: WebdriverIO.Browser)
    /**
     * navigate to a route/view of a UI5 app - by router object
     *
     * @param withSHash a UI5 router object, e.g. {sHash:"#/accounts/create"}
     * @param browserInstance the currently remote controlled browser
     */
    static async goTo(withSHash: any, browserInstance?: WebdriverIO.Browser)
    /**
     * navigate to a route/view of a UI5 app - by string hash
     *
     * @hash hash hash-part of the URL, e.g. "#/accounts/create"
     * @param browserInstance the currently remote controlled browser
     */
    static async goTo(hash: string, browserInstance?: WebdriverIO.Browser)

    /**
     * @deprecated please supply only a single parameter to .goTo() and optionally a browser instance
     */
    static async goTo(param: any, oRoute: any, browserInstance?: WebdriverIO.Browser)
    static async goTo(byWhat, oRoute: any, browserInstance: WebdriverIO.Browser = browser) {
        if (oRoute) {
            Logger.getInstance().warn(
                "deprecated signature: please use single parameter as nav target: wdi5.goTo(target)"
            )
            byWhat = oRoute
        }
        if (typeof byWhat === "string") {
            Logger.getInstance().info(`Navigating via string hash: ${byWhat}`)
            await browserInstance.goTo(byWhat)
        } else if (typeof byWhat === "object" && byWhat.sHash) {
            Logger.getInstance().info(`Navigating via object w/ property sHash: ${JSON.stringify(byWhat)}`)
            await browserInstance.goTo(byWhat)
        } else if (typeof byWhat === "object") {
            Logger.getInstance().info(`Navigating via UI5 router object: ${JSON.stringify(byWhat)}`)
            await browserInstance.goTo({ oRoute: byWhat })
        } else {
            Logger.getInstance().info(`Navigating via generic object: ${JSON.stringify(byWhat)}`)
            await browserInstance.goTo({ byWhat })
        }
    }
}
