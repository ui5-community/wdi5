async function clientSide_testLibrary(pageObject, aMethods, oOptions, isAssertion = false) {
    return await browser.executeAsync(
        (pageObject, aMethods, oOptions, isAssertion, done) => {
            window.bridge
                .waitForUI5(window.wdi5.waitForUI5Options)
                .then(() => {
                    window.wdi5.Log.info(
                        "[browser wdi5 FE] working " + aMethods.join(", ") + " for FE page" + pageObject
                    )

                    // "cache" created page objects to avoid dups
                    if (!window.wdi5.pageObjects) {
                        window.wdi5.pageObjects = {}
                    }
                    let pageClass
                    if (!window.wdi5.pageObjects[pageObject]) {
                        pageClass = new window.fe_bridge[pageObject](oOptions, {
                            // TODO: this will need to come via oOptions
                            actions: {},
                            assertions: {}
                        })
                        window.wdi5.pageObjects[pageObject] = pageClass
                    } else {
                        pageClass = window.wdi5.pageObjects[pageObject]
                    }
                    return pageClass
                })
                .then((pageClass) => {
                    // put page into OPA queue
                    // TODO: support page objects other than main page
                    sap.ui.test.Opa5.createPageObjects({ onTheMainPage: pageClass })

                    // mock the generic OK handler in order to support assertions
                    sap.ui.test.Opa5.assert = {
                        ok: function () {
                            window.wdi5.Log.info("mocked assert!")
                            return true
                        }
                    }

                    const scope = isAssertion
                        ? sap.ui.test.Opa.config.assertions.onTheMainPage
                        : sap.ui.test.Opa.config.actions.onTheMainPage

                    // execute all passed in methods
                    aMethods.reduce((obj, methodName) => {
                        return obj[methodName]()
                    }, scope)

                    // shoot off OPA queue execution
                    return sap.ui.test.Opa.emptyQueue()
                })
                .then(() => {
                    done(["success", true])
                })
                .catch((err) => {
                    debugger
                    window.wdi5.Log.error(err)
                    done(["error", err.toString()])
                })
        },
        pageObject,
        aMethods,
        oOptions,
        isAssertion
    )
}

async function initOPA(pageObjectConfig) {
    return await browser.executeAsync((pageObjectConfig, done) => {
        window.bridge
            .waitForUI5(window.wdi5.waitForUI5Options)
            .then(() => {
                const pageConfig = {}
                Object.keys(pageObjectConfig).map((pageKey) => {
                    Object.keys(pageObjectConfig[pageKey]).forEach((className) => {
                        const options = pageObjectConfig[pageKey][className]
                        pageConfig[pageKey] = new window.fe_bridge[className](options, {
                            // TODO: this will need to come via oOptions
                            actions: {},
                            assertions: {}
                        })
                    })
                })
                sap.ui.test.Opa5.createPageObjects(pageConfig)
                // mock the generic OK handler in order to support assertions
                sap.ui.test.Opa5.assert = {
                    ok: function () {
                        //window.wdi5.Log.info("mocked assert!")
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
async function emptyQueue() {
    return await browser.executeAsync((done) => {
        window.bridge
            .waitForUI5(window.wdi5.waitForUI5Options)
            .then(() => {
                return sap.ui.test.Opa.emptyQueue()
            })
            .then(() => {
                done(["success", true])
            })
            .catch((err) => {
                window.wdi5.Log.error(err)
                debugger
                done(["error", err.errorMessage])
            })
    })
}

async function addToQueue(type, target, aMethods) {
    return await browser.executeAsync(
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

module.exports = {
    clientSide_testLibrary,
    emptyQueue,
    initOPA,
    addToQueue
}
