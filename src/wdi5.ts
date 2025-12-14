import Authenticator from "./lib/authentication/Authenticator.js"
import { Logger } from "./lib/Logger.js"

const authenticatorInstances: Record<string, Authenticator> = {}

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
        await browser.switchFrame($("iframe"))
        await browser.pause(100) // let the browsing context settle
    }

    //// REVISIT: not yet/if still needed :)
    // static wz = new Proxy(this, {
    //     get(target, prop, receiver) {
    //         browser.switchToParentFrame()

    //         // eslint-disable-next-line prefer-rest-params
    //         console.log("GET", ...arguments)
    //         Reflect.get(odatav4Lib, prop, receiver)

    //         browser.switchFrame(null)
    //     }
    // })

    /**
     * expose the current authentication status
     *
     * @param browserInstanceName
     * @returns the current authentication status
     */
    static async isLoggedIn(browserInstanceName?: string): Promise<boolean> {
        let authenticatorInstance: Authenticator
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
    /**
     * navigate to a route/view of a UI5 app
     *
     * @param target either a string hash (e.g. "#/accounts/create") or a router descriptor object (e.g. { sHash:"#/accounts/create"} or UI5 router object)
     * @param browserInstance the currently remote controlled browser
     */
    static async goTo(target: string | Record<string, any>, browserInstance?: WebdriverIO.Browser): Promise<void>

    /**
     * @deprecated please supply only a single parameter to .goTo() and optionally a browser instance
     */
    static async goTo(param: any, oRoute: any, browserInstance?: WebdriverIO.Browser): Promise<void>
    static async goTo(
        byWhat: string | Record<string, any>,
        oRoute?: any,
        browserInstance: WebdriverIO.Browser = browser
    ) {
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
