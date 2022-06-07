async function clientSide_fireEvent(webElement, eventName, oOptions, browserInstance) {
    return await browserInstance.executeAsync(
        (webElement, eventName, oOptions, done) => {
            window.wdi5.waitForUI5(
                window.wdi5.waitForUI5Options,
                () => {
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
                            done({ status: 0, resuklt: true })
                        } catch (e) {
                            window.wdi5.errorHandling.bind(this, done)
                        }
                    } else {
                        window.wdi5.errorHandling(this, done)
                    }
                },
                window.wdi5.errorHandling.bind(this, done)
            )
        },
        webElement,
        eventName,
        oOptions
    )
}

module.exports = {
    clientSide_fireEvent
}
