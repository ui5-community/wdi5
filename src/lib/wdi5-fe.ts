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
    constructor(private appConfig: any, private browserInstance: any) {}
    static async initialize(appConfig, browserInstance = browser) {
        await loadFELibraries(browserInstance)
        await initOPA(appConfig, browserInstance)
        return new WDI5FE(appConfig, browserInstance)
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
