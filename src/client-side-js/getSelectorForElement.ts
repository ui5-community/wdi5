import type RecordReplay from "sap/ui/test/RecordReplay"
import type { ControlSelectorByDOMElementOptions } from "../types/wdi5.types.js"

// TODO: Test is missing!
async function clientSide_getSelectorForElement(
    oOptions: ControlSelectorByDOMElementOptions,
    browserInstance: WebdriverIO.Browser
) {
    return await browserInstance.execute(async function wdi5_getSelectorForElement(oOptions) {
        try {
            await (window.bridge as unknown as typeof RecordReplay).waitForUI5(window.wdi5.waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] locating domElement")
        let controlSelector
        try {
            controlSelector = await (window.bridge as unknown as typeof RecordReplay).findControlSelectorByDOMElement(
                oOptions
            )
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] controlLocator created!")
        return { status: 0, result: controlSelector }
    }, oOptions)
}

export { clientSide_getSelectorForElement }
