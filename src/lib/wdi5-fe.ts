import { clientSide_testLibrary, initOPA, addToQueue, emptyQueue } from "../../client-side-js/testLibrary"
import { Logger as _Logger } from "./Logger"
const Logger = _Logger.getInstance()

function createProxy(myObj: any, type: string, methodCalls: any[]) {
    const thisProxy = new Proxy(myObj, {
        get: function (obj, prop) {
            console.log(prop)
            if (prop === "onTheMainPage") {
                myObj.currentMethodCall = { type: type, target: prop, methods: [] }
                methodCalls.push(myObj.currentMethodCall)
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
        await initOPA(appConfig)
        return new WDI5FE(appConfig)
    }

    async execute(fnFunction) {
        const methodCalls = []

        const Given = createProxy({}, "Given", methodCalls)
        const Then = createProxy({}, "Then", methodCalls)
        const When = createProxy({}, "When", methodCalls)
        fnFunction(Given, Then, When) // PrepareQueue
        for (const methodCall of methodCalls) {
            const [type, content] = await addToQueue(methodCall.type, methodCall.target, methodCall.methods)
            if (type !== "success") {
                throw content
            }
        }
        // ExecuteTest
        const [type, content] = await emptyQueue()
        if (type !== "success") {
            throw content
        }
    }
}
