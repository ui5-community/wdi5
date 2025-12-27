import type { InteractWithControlOptions, clientSide_ui5Response } from "../types/wdi5.types.js"
import { clientSide_checkForWdi5BrowserReady } from "./checkForWdi5BrowserReady.js"

async function clientSide_interactWithControl(
    oOptions: InteractWithControlOptions,
    browserInstance: WebdriverIO.Browser
): Promise<clientSide_ui5Response> {
    browserInstance = await Promise.resolve(browserInstance)
    await clientSide_checkForWdi5BrowserReady(browserInstance)
    return await browserInstance.execute(async function wdi5_interactWithControl(oOptions) {
        try {
            await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] locating controlSelector")
        // @ts-expect-error: Property 'I18NText' is missing in type 'wdi5ControlSelector' but required in type 'ControlSelector'
        oOptions.selector = window.wdi5.createMatcher(oOptions.selector)

        try {
            const result = await window.bridge.interactWithControl(oOptions)
            window.wdi5.Log.info("[browser wdi5] interaction complete! - Message: " + result)
            return { status: 0, result }
        } catch (error) {
            // this return "status" : 1 as part of the returned object
            return window.wdi5.errorHandling(error)
        }
    }, oOptions)
}

export { clientSide_interactWithControl }
