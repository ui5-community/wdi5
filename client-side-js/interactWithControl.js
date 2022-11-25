async function clientSide_interactWithControl(oOptions, browserInstance) {
    browserInstance = await Promise.resolve(browserInstance)
    return await browserInstance.executeAsync((oOptions, done) => {
        window.wdi5.waitForUI5(
            window.wdi5.waitForUI5Options,
            () => {
                window.wdi5.Log.info("[browser wdi5] locating controlSelector")
                oOptions.selector = window.wdi5.createMatcher(oOptions.selector)
                window.bridge
                    .interactWithControl(oOptions)
                    .then((result) => {
                        window.wdi5.Log.info("[browser wdi5] interaction complete! - Message: " + result)
                        done({ status: 0, result: result })
                    })
                    .catch(window.wdi5.errorHandling.bind(this, done))
            },
            window.wdi5.errorHandling.bind(this, done)
        )
    }, oOptions)
}

module.exports = {
    clientSide_interactWithControl
}
