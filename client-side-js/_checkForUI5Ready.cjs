async function clientSide__checkForUI5Ready(browserInstance) {
    return await browserInstance.execute(async () => {
        try {
            await window.wdi5.waitForUI5(window.wdi5.waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }
        window.wdi5.Log.info("[browser wdi5] UI5 is ready")
        return true
    })
}

module.exports = {
    clientSide__checkForUI5Ready
}
