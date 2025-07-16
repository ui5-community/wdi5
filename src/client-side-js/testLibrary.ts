import type Opa from "sap/ui/test/Opa"
import type Opa5 from "sap/ui/test/Opa5"
import type RecordReplay from "sap/ui/test/RecordReplay"

async function initOPA(pageObjectConfig, browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async (pageObjectConfig) => {
        try {
            await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)
            const [OpaRef, Opa5Ref] = await new Promise<[Opa, Opa5]>((resolve) => {
                sap.ui.require(["sap/ui/test/Opa", "sap/ui/test/Opa5"], function () {
                    // @ts-expect-error: Argument of type 'any[]' is not assignable to parameter of type...
                    // eslint-disable-next-line prefer-rest-params
                    resolve(Array.from(arguments))
                })
            })
            const pageConfig = {}
            Object.keys(pageObjectConfig).map((pageKey) => {
                Object.keys(pageObjectConfig[pageKey]).forEach((className) => {
                    const options = pageObjectConfig[pageKey][className]
                    pageConfig[pageKey] = new window.fe_bridge[className](options)
                })
            })

            // @ts-expect-error: Property 'Opa5' does not exist on type 'typeof sap.ui.test'
            Opa5Ref.createPageObjects(pageConfig)
            // @ts-expect-error: Property 'Opa' does not exist on type 'typeof sap.ui.test'
            // use the same timouts and intervals that wdi5 uses
            OpaRef.extendConfig({
                timeout: Math.floor(window.wdi5.waitForUI5Options.timeout / 1000), // convert milliseconds to seconds
                pollingInterval: window.wdi5.waitForUI5Options.interval
            })

            // @ts-expect-error: Property 'Opa5' does not exist on type 'typeof sap.ui.test'
            // mock the generic OK handler in order to support assertions
            Opa5Ref.assert = {
                ok: function (bSuccess: boolean, responseText: string) {
                    window?.fe_bridge?.Log?.push(responseText)
                    return true
                }
            }

            return ["success", true]
        } catch (error) {
            // different error handling for the test library
            return ["error", error?.toString()]
        }
    }, pageObjectConfig)
}
async function emptyQueue(browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async () => {
        try {
            await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)
            const [OpaRef] = await new Promise<[Opa]>((resolve) => {
                sap.ui.require(["sap/ui/test/Opa"], function () {
                    // @ts-expect-error: Argument of type 'any[]' is not assignable to parameter of type...
                    // eslint-disable-next-line prefer-rest-params
                    resolve(Array.from(arguments))
                })
            })
            await OpaRef.emptyQueue()
            const feLogs = window.fe_bridge.Log
            window.fe_bridge.Log = []
            return { type: "success", feLogs: feLogs }
        } catch (error) {
            return {
                type: "error",
                message:
                    error instanceof Error
                        ? `The execution of the test library probably took to long. Try to increase the UI5 Timeout or reduce the individual steps. ${error.message}`
                        : error.errorMessage
            }
        }
    })
}

async function addToQueue(methodCalls, browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async (methodCalls) => {
        try {
            await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)
            const [OpaRef] = await new Promise<[Opa]>((resolve) => {
                sap.ui.require(["sap/ui/test/Opa"], function () {
                    // @ts-expect-error: Argument of type 'any[]' is not assignable to parameter of type...
                    // eslint-disable-next-line prefer-rest-params
                    resolve(Array.from(arguments))
                })
            })

            // @ts-expect-error: Type 'HTMLElement' must have a '[Symbol.iterator]()' method that returns an iterator.
            for (const methodCall of methodCalls) {
                let scope
                switch (methodCall.type) {
                    case "Given":
                        // @ts-expect-error: Property 'Opa' does not exist on type 'typeof sap.ui.test'
                        scope = OpaRef.config.arrangements
                        break
                    case "When":
                        // @ts-expect-error: Property 'Opa' does not exist on type 'typeof sap.ui.test'
                        scope = OpaRef.config.actions
                        break
                    case "Then":
                        // @ts-expect-error: Property 'Opa' does not exist on type 'typeof sap.ui.test'
                        scope = OpaRef.config.assertions
                        break
                }
                scope = scope[methodCall.target]
                // execute all passed in methods
                methodCall.methods.reduce((obj, methodInfo) => {
                    if (methodInfo.accessor) {
                        return obj[methodInfo.name]
                    }
                    // eslint-disable-next-line prefer-spread
                    return obj[methodInfo.name].apply(obj, methodInfo.args)
                }, scope)
            }

            return { type: "success" }
        } catch (error) {
            window.wdi5.Log.error(error)
            return {
                type: "error",
                message: `The test library was called with unknown functions! ${error?.toString()}`
            }
        }
    }, methodCalls)
}

async function loadFELibraries(browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async () => {
        return await new Promise<void>((resolve) => {
            sap.ui.require(
                ["sap/fe/test/ListReport", "sap/fe/test/ObjectPage", "sap/fe/test/Shell"],
                (ListReport, ObjectPage, Shell) => {
                    window.fe_bridge.ListReport = ListReport
                    window.fe_bridge.ObjectPage = ObjectPage
                    window.fe_bridge.Shell = Shell
                    // logs for the FE Testlib responses
                    window.fe_bridge.Log = []
                    resolve()
                }
            )
        })
    })
}

export { emptyQueue, initOPA, addToQueue, loadFELibraries }
