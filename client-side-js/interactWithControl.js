async function clientSide_interactWithControl(oOptions) {
    return await browser.executeAsync((oOptions, done) => {
        const errorHandling = (error) => {
            window.wdi5.Log.error("[browser wdi5] ERR: ", error)
            done(["error", error.toString()])
        }

        window.wdi5.waitForUI5(
            window.wdi5.waitForUI5Options,
            () => {
                window.wdi5.Log.info("[browser wdi5] locating controlSelector")
                oOptions.selector = window.wdi5.createMatcher(oOptions.selector)
                window.bridge
                    .interactWithControl(oOptions)
                    .then((result) => {
                        window.wdi5.Log.info("[browser wdi5] interaction complete! - Message: " + result)
                        done(["success", result])
                    })
                    .catch(errorHandling)
            },
            errorHandling
        )
    }, oOptions)
}

module.exports = {
    clientSide_interactWithControl
}
