import type RecordReplay from "sap/ui/test/RecordReplay"
import type { wdi5Selector } from "../types/wdi5.types.js"

async function clientSide_allControls(controlSelector: wdi5Selector, browserInstance: WebdriverIO.Browser) {
    controlSelector = await Promise.resolve(controlSelector) // to plug into fluent async api
    return await browserInstance.execute(async function wdi5_allControls(controlSelector) {
        const waitForUI5Options = Object.assign({}, window.wdi5.waitForUI5Options)
        if (controlSelector.timeout) {
            waitForUI5Options.timeout = controlSelector.timeout
        }

        try {
            await (window.bridge as unknown as typeof RecordReplay).waitForUI5(waitForUI5Options)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        window.wdi5.Log.info("[browser wdi5] locating " + JSON.stringify(controlSelector))
        controlSelector.selector = window.wdi5.createMatcher(controlSelector.selector)
        let domElements

        try {
            // @ts-expect-error: Property 'findAllDOMElementsByControlSelector' does not exist on type 'Bridge'
            domElements = await window.bridge.findAllDOMElementsByControlSelector(controlSelector)
        } catch (error) {
            return window.wdi5.errorHandling(error)
        }

        // ui5 control
        const returnElements = []
        domElements.forEach((domElement) => {
            const ui5Control = window.wdi5.getUI5CtlForWebObj(domElement)
            const id = ui5Control.getId()
            window.wdi5.Log.info(`[browser wdi5] control with id: ${id} located!`)
            const aProtoFunctions = window.wdi5.retrieveControlMethods(ui5Control)
            // @type [String, String?, String, "Array of Strings"]
            returnElements.push({
                domElement: domElement,
                id: id,
                aProtoFunctions: aProtoFunctions
            })
        })

        return { status: 0, result: returnElements }
    }, controlSelector)
}

export { clientSide_allControls }
