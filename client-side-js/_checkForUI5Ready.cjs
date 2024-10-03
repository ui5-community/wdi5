async function clientSide__checkForUI5Ready(browserInstance) {
    return await browserInstance.execute(async () => {
        try {
            await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)
            window.wdi5.Log.info("[browser wdi5] UI5 is ready")
            return true
        } catch (error) {
            console.error(error)
        }
    })
}

module.exports = {
    clientSide__checkForUI5Ready
}
