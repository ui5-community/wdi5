async function clientSide_interactWithControl(oOptions, browserInstance) {
    browserInstance = await Promise.resolve(browserInstance)
    return await browserInstance.execute(async (oOptions) => {
        try {
            await window.wdi5.waitForUI5(window.wdi5.waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] locating controlSelector")
        oOptions.selector = window.wdi5.createMatcher(oOptions.selector)

        try {
            const result = await window.bridge.interactWithControl(oOptions)
            window.wdi5.Log.info("[browser wdi5] interaction complete! - Message: " + result)
            return { status: 0, result }
        } catch (error) {
            // this return "status" : 1 as part of the returned object
            return window.wdi5.errorHandling(error)
        }
    }, oOptions)
}

module.exports = {
    clientSide_interactWithControl
}
