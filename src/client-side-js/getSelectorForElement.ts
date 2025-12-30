import type { ControlSelectorByDOMElementOptions, clientSide_ui5Response } from "../types/wdi5.types.js"
import { clientSide_checkForWdi5BrowserReady } from "./checkForWdi5BrowserReady.js"

// TODO: Test is missing!
async function clientSide_getSelectorForElement(
    oOptions: ControlSelectorByDOMElementOptions,
    browserInstance: WebdriverIO.Browser
): Promise<clientSide_ui5Response> {
    await clientSide_checkForWdi5BrowserReady(browserInstance)
    return await browserInstance.execute(async function wdi5_getSelectorForElement(oOptions) {
        try {
            await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] locating domElement")
        let controlSelector
        try {
            controlSelector = await window.bridge.findControlSelectorByDOMElement(oOptions)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] controlLocator created!")
        return { status: 0, result: controlSelector }
    }, oOptions)
}

export { clientSide_getSelectorForElement }
