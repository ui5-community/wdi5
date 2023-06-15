async function clientSide__checkForUI5Ready(browserInstance) {
    return await browserInstance.executeAsync((done) => {
        window.bridge
            .waitForUI5(window.wdi5.waitForUI5Options)
            .then(() => {
                window.wdi5.Log.info("[browser wdi5] UI5 is ready")
                done(true)
            })
            .catch((error) => {
                console.error(error)
            })
    })
}

module.exports = {
    clientSide__checkForUI5Ready
}
