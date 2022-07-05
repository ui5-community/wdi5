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
                done(["success", true, window.fe_bridge.Log])
                window.fe_bridge.Log = []
            })
            .catch((err) => {
                window.wdi5.Log.error(err)
                done(["error", err.errorMessage])
            })
    })
}

async function addToQueue(type, target, aMethods, browserInstance) {
    return await browserInstance.executeAsync(
        (type, target, aMethods, done) => {
            window.bridge
                .waitForUI5(window.wdi5.waitForUI5Options)
                .then(() => {
                    let scope
                    switch (type) {
                        case "Given":
                            scope = sap.ui.test.Opa.config.arrangements
                            break
                        case "Then":
                            scope = sap.ui.test.Opa.config.actions
                            break
                        case "When":
                            scope = sap.ui.test.Opa.config.assertions
                            break
                    }
                    scope = scope[target]
                    // execute all passed in methods
                    aMethods.reduce((obj, methodInfo) => {
                        if (methodInfo.accessor) {
                            return obj[methodInfo.name]
                        }
                        return obj[methodInfo.name].apply(obj, methodInfo.args)
                    }, scope)
                })
                .then(() => {
                    done(["success", true])
                })
                .catch((err) => {
                    window.wdi5.Log.error(err)
                    done(["error", err.toString()])
                })
        },
        type,
        target,
        aMethods
    )
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
