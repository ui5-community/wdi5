async function clientSide_checkForWdi5BrowserReady(browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async function wdi5_checkForWdi5BrowserReady() {
        if (!window.wdi5) {
            const message = "window.wdi5 is not available in the browser context!"
            console.error(message) // eslint-disable-line no-console
            throw new Error(message)
        }
        if (!window.bridge) {
            const message = "window.bridge is not available in the browser context!"
            console.error(message) // eslint-disable-line no-console
            throw new Error(message)
        }
    })
}

export { clientSide_checkForWdi5BrowserReady }
