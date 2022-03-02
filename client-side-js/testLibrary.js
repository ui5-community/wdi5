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

module.exports = {
    clientSide_testLibrary
}
