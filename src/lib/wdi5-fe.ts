import { Element } from "webdriverio"
import { initOPA, addToQueue, emptyQueue, loadFELibraries } from "../../client-side-js/testLibrary.cjs"
import { Logger as _Logger } from "./Logger.js"
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
            return function (...fnArgs) {
                myObj.currentMethodCall.methods.push({ name: prop, args: fnArgs })
                return thisProxy
            }
        }
    })
    return thisProxy
}
export class WDI5FE {
    onTheShell: any

    constructor(
        private appConfig: any,
        private browserInstance: any,
        private shell?: any
    ) {
        // only in the workzone context
        // do we need to hotwire a back navigation on the fiori shell
        if (shell) {
            this.onTheShell = {
                iNavigateBack: async () => {
                    await this.toShell()
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    await this.shell.execute((Given, When, Then) => {
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
        await browser.switchToFrame(0)
    }

    static async initialize(appConfig, browserInstance = browser) {
        // first magic wand wave -> app context
        await loadFELibraries(browserInstance)
        await initOPA(appConfig, browserInstance)

        // second magic wand wave -> shell context
        // yet only wave the wand when there's an iframe somewhere,
        // indicating BTP WorkZone territory
        await browserInstance.switchToParentFrame()
        // @ts-ignore
        const iframe: Element = await browserInstance.findElement("css selector", "iframe")
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
            await browserInstance.switchToFrame(0)
        } else {
            // revert back to app context
            await browserInstance.switchToFrame(null)
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
