async function fireEvent(webElement, eventName, oOptions) {
    return await browser.executeAsync(
        (webElement, eventName, oOptions, done) => {
            window.bridge.waitForUI5(window.wdi5.waitForUI5Options).then(() => {
                window.wdi5.Log.info("[browser wdi5] working " + eventName + " for " + webElement)
                // DOM to ui5
                let oControl = window.wdi5.getUI5CtlForWebObj(webElement)
                if (oControl && oControl.hasListeners(eventName)) {
                    window.wdi5.Log.info("[browser wdi5] firing " + eventName + " on " + webElement)
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
                    window.wdi5.Log.error("[browser wdi5] couldn't find " + webElement)
                    done(["error", false])
                }
            })
        },
        webElement,
        eventName,
        oOptions
    )
}
