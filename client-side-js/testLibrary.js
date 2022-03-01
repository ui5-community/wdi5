async function clientSide_testLibrary(pageObject, eventName, oOptions) {
    return await browser.executeAsync(
        (pageObject, eventName, oOptions, done) => {
            window.bridge.waitForUI5(window.wdi5.waitForUI5Options).then(() => {
                window.wdi5.Log.info("[browser wdi5 FE] working " + eventName + " for FE page" + pageObject)

                const pageClass = new window.fe_bridge[pageObject](oOptions)

                // DOM to ui5
                let oControl = window.wdi5.getUI5CtlForWebObj(pageObject)
                if (oControl && oControl.hasListeners(eventName)) {
                    window.wdi5.Log.info("[browser wdi5] firing " + eventName + " on " + pageObject)
                    // element existent and has the target event
                    try {
                        // eval the options indicated by option of type string
                        if (typeof oOptions === "string") {
                            oOptions = eval(oOptions)()
                        }
                        oControl.fireEvent(eventName, oOptions)
                        // convert to boolean
                        done(["success", true])
                    } catch (e) {
                        done(["error", e.toString()])
                    }
                } else {
                    window.wdi5.Log.error("[browser wdi5] couldn't find " + pageObject)
                    done(["error", false])
                }
            })
        },
        pageObject,
        eventName,
        oOptions
    )
}

module.exports = {
    clientSide_testLibrary
}
