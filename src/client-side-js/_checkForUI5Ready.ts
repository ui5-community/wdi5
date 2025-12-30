import { clientSide_checkForWdi5BrowserReady } from "./checkForWdi5BrowserReady.js"

async function clientSide_checkForUI5Ready(browserInstance: WebdriverIO.Browser) {
    await clientSide_checkForWdi5BrowserReady(browserInstance)
    return await browserInstance.execute(async function wdi5_checkForUI5Ready() {
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
