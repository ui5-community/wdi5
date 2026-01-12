async function clientSide_checkForUI5Ready(browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async function wdi5_checkForUI5Ready() {
        if (!window.wdi5 || !window.bridge) {
            // Local checkForWdi5BrowserReady.js for better performance
            const wdi5MissingErr = new Error(
                `WDI5 is not available in the browser context! window.wdi5: ${!!window.wdi5} | window.bridge: ${!!window.bridge}`
            )
            console.error(wdi5MissingErr) // eslint-disable-line no-console
            throw wdi5MissingErr
        }
        try {
            await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }
        window.wdi5.Log.info("[browser wdi5] UI5 is ready")
        return true
    })
}

export { clientSide_checkForUI5Ready }
