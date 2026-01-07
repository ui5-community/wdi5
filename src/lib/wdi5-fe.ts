import { initOPA, addToQueue, emptyQueue, loadFELibraries } from "../client-side-js/testLibrary.js"
import { checkForUI5Page, injectUI5 } from "./wdi5-bridge.js"
import { Logger as _Logger } from "./Logger.js"
import type { wdi5Config } from "../types/wdi5.types.js"
const Logger = _Logger.getInstance()

const commonFunctions = ["and", "when", "then"]
function createProxy(myObj: any, type: string, methodCalls: any[], pageKeys: string[]) {
    const thisProxy = new Proxy(myObj, {
        get: function (obj, prop: string) {
            if (pageKeys.indexOf(prop) !== -1) {
                myObj.currentMethodCall = { type: type, target: prop, methods: [] }
                methodCalls.push(myObj.currentMethodCall)
                return thisProxy
            } else if (commonFunctions.indexOf(prop) !== -1) {
                myObj.currentMethodCall.methods.push({ name: prop, accessor: true })
                return thisProxy
            }
            return function (...fnArgs: unknown[]) {
                myObj.currentMethodCall.methods.push({ name: prop, args: fnArgs })
                return thisProxy
            }
        }
    })
    return thisProxy
}
export class WDI5FE {
    private appConfig: any
    private browserInstance: WebdriverIO.Browser
    private shell?: any
    onTheShell: any

    constructor(appConfig: any, browserInstance: WebdriverIO.Browser, shell?: any) {
        this.appConfig = appConfig
        this.browserInstance = browserInstance
        // only in the workzone context
        // do we need to hotwire a back navigation on the fiori shell
        if (shell) {
            this.onTheShell = {
                iNavigateBack: async () => {
                    await this.toShell()
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    await this.execute((Given, When, Then) => {
                        When.onTheShell.iNavigateBack()
                    })
                    await this.toApp()
                }
            }
        }
    }

    async toShell() {
        await browser.switchToParentFrame()
    }

    async toApp() {
        await browser.switchFrame($("iframe"))
    }

    static async initialize(appConfig, browserInstance = browser) {
        // Ensure wdi5 bridge is injected before loading FE libraries
        // This handles cases where browser context was lost (e.g., due to redirects)
        const isUI5Page = await checkForUI5Page(browserInstance)
        if (!isUI5Page) {
            throw new Error(
                "[wdi5] No UI5 page detected. Cannot initialize FE test library. " +
                    "Make sure you have navigated to a UI5 application before calling browser.fe.initialize()."
            )
        }

        // Check if wdi5 bridge is present, re-inject if needed
        const bridgePresent = await browserInstance.execute(() => !!window.bridge && !!window.fe_bridge)
        if (!bridgePresent) {
            Logger.warn("[wdi5] Browser context lost (possibly due to a redirect). Re-injecting wdi5 bridge...")
            const config: wdi5Config = global.__wdi5Config || (browserInstance.options as wdi5Config)
            await injectUI5(config, browserInstance)
        }

        // first magic wand wave -> app context
        await loadFELibraries(browserInstance)
        await initOPA(appConfig, browserInstance)

        // second magic wand wave -> shell context
        // yet only wave the wand when there's an iframe somewhere,
        // indicating BTP WorkZone territory
        await browserInstance.switchToParentFrame()
        // @ts-expect-error TODO: fix types
        const iframe: WebdriverIO.Element = await browserInstance.findElement("css selector", "iframe")
        let shell
        if (!iframe.error) {
            const shellConfig = {
                onTheShell: {
                    Shell: {}
                }
            }
            shell = new WDI5FE(shellConfig, browserInstance)
            await loadFELibraries(browserInstance)
            await initOPA(shellConfig, browserInstance)

            // back to app
            try {
                await browserInstance.switchFrame($("iframe"))
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                // This try-catch block is a fail-safe code to make sure the execution continues if browser fails to switch to app's frame.
                // It has been observed that for Launchpad apps, the switchFrame(null) is not required.
                Logger.info("Failed to switch to app's frame - you're probably in a Launchpad env. Continuing...")
            }
        } else {
            // if iframe not found or errored goto parent or null
            await browserInstance.switchFrame(null)
        }
        return new WDI5FE(appConfig, browserInstance, shell)
    }

    async execute(fnFunction) {
        const methodCalls = []
        const reservedPages = Object.keys(this.appConfig).concat()
        const Given = createProxy({}, "Given", methodCalls, reservedPages)
        const When = createProxy({}, "When", methodCalls, reservedPages)
        const Then = createProxy({}, "Then", methodCalls, reservedPages)
        fnFunction(Given, When, Then) // PrepareQueue

        const addToQueueResponse = await addToQueue(methodCalls, this.browserInstance)
        if (addToQueueResponse.type !== "success") {
            throw addToQueueResponse.message
        }
        // ExecuteTest
        const emptyQueueResponse = await emptyQueue(this.browserInstance)
        if (emptyQueueResponse.type !== "success") {
            throw emptyQueueResponse.message
        }
        for (const log of emptyQueueResponse.feLogs) {
            Logger.success(`[test library] ${log}`)
        }
    }
}
