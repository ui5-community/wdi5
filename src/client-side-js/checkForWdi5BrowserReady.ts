async function clientSide_checkForWdi5BrowserReady(browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async function wdi5_checkForWdi5BrowserReady() {
        if (!window.wdi5 || !window.bridge) {
            const wdi5MissingErr = new Error(
                `WDI5 is not available in the browser context! window.wdi5: ${!!window.wdi5} | window.bridge: ${!!window.bridge}`
            )
            console.error(wdi5MissingErr) // eslint-disable-line no-console
            throw wdi5MissingErr
        }
    })
}

export { clientSide_checkForWdi5BrowserReady }
