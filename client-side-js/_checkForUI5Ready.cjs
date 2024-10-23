async function clientSide__checkForUI5Ready(browserInstance) {
    return await browserInstance.execute(async () => {
        await window.bridge.waitForUI5(window.wdi5.waitForUI5Options).catch(window.wdi5.errorHandling.bind(this))
        window.wdi5.Log.info("[browser wdi5] UI5 is ready")
        return true
    })
}

module.exports = {
    clientSide__checkForUI5Ready
}
