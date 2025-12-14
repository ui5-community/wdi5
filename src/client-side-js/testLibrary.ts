import type Opa from "sap/ui/test/Opa"
import type Opa5 from "sap/ui/test/Opa5"
import type ListReport from "sap/fe/test/ListReport"
import type ObjectPage from "sap/fe/test/ObjectPage"
import type Shell from "sap/fe/test/Shell"
import { ProxyMethodCall, FETestLibraryResponse } from "../types/wdi5.types.js"

async function initOPA(pageObjectConfig, browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async function wdi5_initOPA(pageObjectConfig) {
        try {
            await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)
            const [OpaRef, Opa5Ref] = await new Promise<[Opa, Opa5]>((resolve, reject) => {
                sap.ui.require(
                    ["sap/ui/test/Opa", "sap/ui/test/Opa5"],
                    function (...args: [Opa, Opa5]) {
                        resolve(args)
                    },
                    reject
                )
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
async function emptyQueue(browserInstance: WebdriverIO.Browser): Promise<FETestLibraryResponse> {
    return await browserInstance.execute(async function wdi5_emptyQueue() {
        let feLogs: FETestLibraryResponse["feLogs"] = []
        try {
            await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)
            const [OpaRef] = await new Promise<[Opa]>((resolve, reject) => {
                sap.ui.require(
                    ["sap/ui/test/Opa"],
                    function (...args: [Opa]) {
                        resolve(args)
                    },
                    reject
                )
            })
            await OpaRef.emptyQueue()
            feLogs = window.fe_bridge.Log || []
            window.fe_bridge.Log = []
            return { type: "success", feLogs: feLogs }
        } catch (error) {
            return {
                type: "error",
                feLogs: feLogs,
                message:
                    error instanceof Error
                        ? `The execution of the test library probably took to long. Try to increase the UI5 Timeout or reduce the individual steps. ${error.message}`
                        : error.errorMessage
            }
        }
    })
}

async function addToQueue(
    methodCalls: ProxyMethodCall[],
    browserInstance: WebdriverIO.Browser
): Promise<FETestLibraryResponse> {
    return await browserInstance.execute(async function wdi5_addToQueue(methodCalls) {
        try {
            await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)
            const [OpaRef] = await new Promise<[Opa]>((resolve, reject) => {
                sap.ui.require(
                    ["sap/ui/test/Opa"],
                    function (...args: [Opa]) {
                        resolve(args)
                    },
                    reject
                )
            })

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
    return await browserInstance.execute(async function wdi5_loadFELibraries() {
        const [ListReport, ObjectPage, Shell] = await new Promise<[ListReport, ObjectPage, Shell]>(
            (resolve, reject) => {
                sap.ui.require(
                    ["sap/fe/test/ListReport", "sap/fe/test/ObjectPage", "sap/fe/test/Shell"],
                    function (...args: [ListReport, ObjectPage, Shell]) {
                        resolve(args)
                    },
                    reject
                )
            }
        )
        window.fe_bridge.ListReport = ListReport
        window.fe_bridge.ObjectPage = ObjectPage
        window.fe_bridge.Shell = Shell
        // logs for the FE Testlib responses
        window.fe_bridge.Log = []
    })
}

export { emptyQueue, initOPA, addToQueue, loadFELibraries }
