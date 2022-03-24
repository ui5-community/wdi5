async function clientSide_interactWithControl(oOptions) {
    return await browser.executeAsync((oOptions, done) => {
        const errorHandling = (error) => {
            window.wdi5.Log.error("[browser wdi5] ERR: ", error)
            done(["error", error.toString()])
        }

        const returnSuccess = (result) => {
            window.wdi5.Log.info("[browser wdi5] interaction complete! - Message: " + result)
            done(["success", result])
        }

        window.wdi5.waitForUI5(window.wdi5.waitForUI5Options, () => {
            window.wdi5.Log.info("[browser wdi5] locating controlSelector")
            oOptions.selector = window.wdi5.createMatcher(oOptions.selector)
            if (parseFloat(sap.ui.version) <= 1.6) {
                // implementing legacy api < 1.60
                window.bridge.findDOMElementByControlSelector(oOptions).then((control, arg) => {
                    const ui5Control = window.wdi5.getUI5CtlForWebObj(control)
                    oOptions.control = ui5Control
                    window.bridge
                        .interactWithControl(oOptions)
                        .then(returnSuccess)
                        .catch(errorHandling)
                })
            } else {
                return window.bridge
                    .interactWithControl(oOptions)
                    .then(returnSuccess)
                    .catch(errorHandling)
            }
        }, errorHandling)
    }, oOptions)
}

module.exports = {
    clientSide_interactWithControl
}
