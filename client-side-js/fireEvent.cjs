//> REVISIT: do we need this at all?
// -> as .fireEvent on a UI5 control in Node.js-scope is discouraged
async function clientSide_fireEvent(webElement, eventName, oOptions, browserInstance) {
    return await browserInstance.execute(
        async (webElement, eventName, oOptions) => {
            await window.wdi5.waitForUI5(window.wdi5.waitForUI5Options).catch(window.wdi5.errorHandling.bind(this))

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
                    return { status: 0, result: true }
                } catch (error) {
                    window.wdi5.errorHandling.bind(this, error)
                }
            } else {
                return window.wdi5.errorHandling("no control and/or no event listener found for " + eventName)
            }
        },
        webElement,
        eventName,
        oOptions
    )
}

module.exports = {
    clientSide_fireEvent
}
