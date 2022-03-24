async function clientSide_interactWithControl(oOptions) {
    oOptions = await Promise.resolve(oOptions) // to plug into fluent async api
    return await browser.executeAsync((oOptions, done) => {
        const waitForUI5Options = Object.assign({}, window.wdi5.waitForUI5Options)
        if (oOptions.timeout) {
            waitForUI5Options.timeout = oOptions.timeout
        }
        window.bridge
            .waitForUI5(waitForUI5Options)
            .then(() => {
                window.wdi5.Log.info("[browser wdi5] locating controlSelector")
                oOptions.selector = window.wdi5.createMatcher(oOptions.selector)
                return window.bridge.interactWithControl(oOptions)
            })
            .then((result) => {
                window.wdi5.Log.info("[browser wdi5] interaction complete! - Message: " + result)
                done(["success", result])
            })
            .catch((error) => {
                window.wdi5.Log.error("[browser wdi5] ERR: ", error)
                done(["error", error.toString()])
            })
    }, oOptions)
}

module.exports = {
    clientSide_interactWithControl
}
