import type RecordReplay from "sap/ui/test/RecordReplay"
import type { InteractWithControlOptions } from "../types/wdi5.types.js"

async function clientSide_interactWithControl(
    oOptions: InteractWithControlOptions,
    browserInstance: WebdriverIO.Browser
) {
    browserInstance = await Promise.resolve(browserInstance)
    return await browserInstance.execute(async function wdi5_interactWithControl(oOptions) {
        try {
            await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] locating controlSelector")
        // @ts-expect-error: Property 'I18NText' is missing in type 'wdi5ControlSelector' but required in type 'ControlSelector'
        oOptions.selector = window.wdi5.createMatcher(oOptions.selector)

        try {
            const result = await (window.bridge as unknown as typeof RecordReplay).interactWithControl(oOptions)
            window.wdi5.Log.info("[browser wdi5] interaction complete! - Message: " + result)
            return { status: 0, result }
        } catch (error) {
            // this return "status" : 1 as part of the returned object
            return window.wdi5.errorHandling(error)
        }
    }, oOptions)
}

export { clientSide_interactWithControl }
