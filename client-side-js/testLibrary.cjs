async function initOPA(pageObjectConfig, browserInstance) {
    return await browserInstance.executeAsync((pageObjectConfig, done) => {
        window.bridge
            .waitForUI5(window.wdi5.waitForUI5Options)
            .then(() => {
                const pageConfig = {}
                Object.keys(pageObjectConfig).map((pageKey) => {
                    Object.keys(pageObjectConfig[pageKey]).forEach((className) => {
                        const options = pageObjectConfig[pageKey][className]
                        pageConfig[pageKey] = new window.fe_bridge[className](options)
                    })
                })

                sap.ui.test.Opa5.createPageObjects(pageConfig)
                // use the same timouts and intervals that wdi5 uses
                sap.ui.test.Opa.extendConfig({
                    timeout: Math.floor(window.wdi5.waitForUI5Options.timeout / 1000), // convert milliseconds to seconds
                    pollingInterval: window.wdi5.waitForUI5Options.interval
                })

                // mock the generic OK handler in order to support assertions
                sap.ui.test.Opa5.assert = {
                    ok: function (bSuccess, responseText) {
                        window.fe_bridge.Log.push(responseText)
                        return true
                    }
                }
            })
            .then(() => {
                done(["success", true])
            })
            .catch((err) => {
                window.wdi5.Log.error(err)
                done(["error", err.toString()])
            })
    }, pageObjectConfig)
}
async function emptyQueue(browserInstance) {
    return await browserInstance.executeAsync((done) => {
        window.bridge
            .waitForUI5(window.wdi5.waitForUI5Options)
            .then(() => {
                return sap.ui.test.Opa.emptyQueue()
            })
            .then(() => {
                done({ type: "success", feLogs: window.fe_bridge.Log })
                window.fe_bridge.Log = []
            })
            .catch((err) => {
                window.wdi5.Log.error(err)
                done({
                    type: "error",
                    message:
                        err instanceof Error
                            ? `The execution of the test library probably took to long. Try to increase the UI5 Timeout or reduce the individual steps. ${err.message}`
                            : err.errorMessage
                })
            })
    })
}

async function addToQueue(methodCalls, browserInstance) {
    return await browserInstance.executeAsync((methodCalls, done) => {
        window.bridge
            .waitForUI5(window.wdi5.waitForUI5Options)
            .then(() => {
                for (const methodCall of methodCalls) {
                    let scope
                    switch (methodCall.type) {
                        case "Given":
                            scope = sap.ui.test.Opa.config.arrangements
                            break
                        case "When":
                            scope = sap.ui.test.Opa.config.actions
                            break
                        case "Then":
                            scope = sap.ui.test.Opa.config.assertions
                            break
                    }
                    scope = scope[methodCall.target]
                    // execute all passed in methods
                    methodCall.methods.reduce((obj, methodInfo) => {
                        if (methodInfo.accessor) {
                            return obj[methodInfo.name]
                        }
                        return obj[methodInfo.name].apply(obj, methodInfo.args)
                    }, scope)
                }
            })
            .then(() => {
                done({ type: "success" })
            })
            .catch((err) => {
                window.wdi5.Log.error(err)
                done({
                    type: "error",
                    message: `The test library was called with unknown functions! ${err.toString()}`
                })
            })
    }, methodCalls)
}

async function loadFELibraries(browserInstance = browser) {
    return await browserInstance.executeAsync((done) => {
        sap.ui.require(
            ["sap/fe/test/ListReport", "sap/fe/test/ObjectPage", "sap/fe/test/Shell"],
            (ListReport, ObjectPage, Shell) => {
                window.fe_bridge.ListReport = ListReport
                window.fe_bridge.ObjectPage = ObjectPage
                window.fe_bridge.Shell = Shell
                // logs for the FE Testlib responses
                window.fe_bridge.Log = []
                done()
            }
        )
    })
}

module.exports = {
    emptyQueue,
    initOPA,
    addToQueue,
    loadFELibraries
}
