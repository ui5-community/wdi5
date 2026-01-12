import type { ControlSelectorByDOMElementOptions, clientSide_ui5Response } from "../types/wdi5.types.js"

// TODO: Test is missing!
async function clientSide_getSelectorForElement(
    oOptions: ControlSelectorByDOMElementOptions,
    browserInstance: WebdriverIO.Browser
): Promise<clientSide_ui5Response> {
    return await browserInstance.execute(async function wdi5_getSelectorForElement(oOptions) {
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
