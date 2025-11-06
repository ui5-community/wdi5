import type RecordReplay from "sap/ui/test/RecordReplay"
import type { wdi5Selector } from "../types/wdi5.types.js"

async function clientSide_getControl(controlSelector: wdi5Selector, browserInstance: WebdriverIO.Browser) {
    controlSelector = await Promise.resolve(controlSelector) // to plug into fluent async api
    return await browserInstance.execute(async function wdi5_getControl(controlSelector) {
        const waitForUI5Options = Object.assign({}, window.wdi5.waitForUI5Options)
        if (controlSelector.timeout) {
            waitForUI5Options.timeout = controlSelector.timeout
        }
        // skip waitForUI5 (only used internally!)
        if (!controlSelector._skipWaitForUI5) {
            try {
                await (window.bridge as unknown as typeof RecordReplay).waitForUI5(waitForUI5Options)
            } catch (error) {
                return window.wdi5.errorHandling(error)
            }
        }

        window.wdi5.Log.info("[browser wdi5] locating " + JSON.stringify(controlSelector))
        controlSelector.selector = window.wdi5.createMatcher(controlSelector.selector)
        let domElement

        try {
            // @ts-expect-error: Property 'findDOMElementByControlSelector' does not exist on type 'RecordReplay'
            domElement = await window.bridge.findDOMElementByControlSelector(controlSelector)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        const ui5Control = window.wdi5.getUI5CtlForWebObj(domElement)
        const id = ui5Control.getId()
        const className = ui5Control.getMetadata().getName()
        window.wdi5.Log.info(`[browser wdi5] control with id: ${id} located!`)
        const aProtoFunctions = window.wdi5.retrieveControlMethods(ui5Control)
        return {
            status: 0,
            domElement: domElement,
            id: id,
            aProtoFunctions: aProtoFunctions,
            className: className
        }
    }, controlSelector)
}

export { clientSide_getControl }
