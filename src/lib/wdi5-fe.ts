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
    constructor(private appConfig: any) {}
    static async initialize(appConfig) {
        await loadLibraries()
        await initOPA(appConfig)
        return new WDI5FE(appConfig)
    }

    async execute(fnFunction) {
        const methodCalls = []
        const reservedPages = Object.keys(this.appConfig).concat()
        const Given = createProxy({}, "Given", methodCalls, reservedPages)
        const Then = createProxy({}, "Then", methodCalls, reservedPages)
        const When = createProxy({}, "When", methodCalls, reservedPages)
        fnFunction(Given, Then, When) // PrepareQueue
        for (const methodCall of methodCalls) {
            const [type, content] = await addToQueue(methodCall.type, methodCall.target, methodCall.methods)
            if (type !== "success") {
                throw content
            }
        }
        // ExecuteTest
        const [type, content, feLogs] = await emptyQueue()
        if (type !== "success") {
            throw content
        }
        for (const log of feLogs) {
            Logger.success(`[test library] ${log}`)
        }
    }
}
