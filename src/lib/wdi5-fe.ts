import { initOPA, addToQueue, emptyQueue, loadFELibraries } from "../../client-side-js/testLibrary"
import { Logger as _Logger } from "./Logger"
const Logger = _Logger.getInstance()

const commonFunctions = ["and", "then", "when"]
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

    constructor(private appConfig: any, private browserInstance: any, private shell?: any) {
        this.browserInstance = browserInstance
        this.shell = shell
        this.onTheShell = {
            iNavigateBack: async () => {
                await this.toShell()
                await this.shell.execute((Given, When, Then) => {
                    When.onTheShell.iNavigateBack()
                })
                await this.toApp()
            }
        }
    }
    static async initialize(appConfig, browserInstance = browser) {
        // first magic wand wave -> app context
        await loadFELibraries(browserInstance)
        await initOPA(appConfig, browserInstance)

        // second magic wand wave -> shell context
        await browser.switchToParentFrame()
        const shellConfig = {
            onTheShell: {
                Shell: {}
            }
        }
        const shell = new WDI5FE(shellConfig, browserInstance)
        await loadFELibraries(browserInstance)
        await initOPA(shellConfig, browserInstance)

        // back to app
        await browser.switchToFrame(0)
        return new WDI5FE(appConfig, browserInstance, shell)
    }

    async toShell() {
        await browser.switchToParentFrame()
    }

    async toApp() {
        await browser.switchToFrame(0)
    }

    async execute(fnFunction) {
        const methodCalls = []
        const reservedPages = Object.keys(this.appConfig).concat()
        const Given = createProxy({}, "Given", methodCalls, reservedPages)
        const Then = createProxy({}, "Then", methodCalls, reservedPages)
        const When = createProxy({}, "When", methodCalls, reservedPages)
        fnFunction(Given, Then, When) // PrepareQueue
        for (const methodCall of methodCalls) {
            const [type, content] = await addToQueue(
                methodCall.type,
                methodCall.target,
                methodCall.methods,
                this.browserInstance
            )
            if (type !== "success") {
                throw content
            }
        }
        // ExecuteTest
        const [type, content, feLogs] = await emptyQueue(this.browserInstance)
        if (type !== "success") {
            throw content
        }
        for (const log of feLogs) {
            Logger.success(`[test library] ${log}`)
        }
    }
}
