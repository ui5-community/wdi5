import type EventProvider from "sap/ui/base/EventProvider"
import type { clientSide_ui5Response } from "../types/wdi5.types.js"
import { clientSide_checkForWdi5BrowserReady } from "./checkForWdi5BrowserReady.js"

//> REVISIT: do we need this at all?
// -> as .fireEvent on a UI5 control in Node.js-scope is discouraged
async function clientSide_fireEvent(
    webElement: WebdriverIO.Element,
    eventName: Parameters<EventProvider["fireEvent"]>["0"],
    oOptions: Parameters<EventProvider["fireEvent"]>["1"],
    browserInstance: WebdriverIO.Browser
): Promise<clientSide_ui5Response> {
    await clientSide_checkForWdi5BrowserReady(browserInstance)
    return await browserInstance.execute(
        async function wdi5_fireEvent(webElement, eventName, oOptions) {
            try {
                await window.bridge.waitForUI5(window.wdi5.waitForUI5Options)
            } catch (error) {
                return window.wdi5.errorHandling(error)
            }

            window.wdi5.Log.info("[browser wdi5] working " + eventName + " for " + webElement)
            // DOM to ui5
            const oControl = window.wdi5.getUI5CtlForWebObj(webElement)
            if (oControl && oControl.hasListeners(eventName)) {
                window.wdi5.Log.info("[browser wdi5] firing " + eventName + " on " + webElement)
                // element existent and has the target event
                try {
                    // eval the options indicated by option of type string
                    if (typeof oOptions === "string") {
                        oOptions = eval(oOptions)()
                    }
                    oControl.fireEvent(eventName, oOptions)
                    // convert to boolean
                    return { status: 0, result: true }
                } catch (error) {
                    return window.wdi5.errorHandling(error)
                }
            } else {
                return window.wdi5.errorHandling("no control and/or no event listener found for " + eventName)
            }
        },
        webElement,
        eventName,
        oOptions
    )
}

export { clientSide_fireEvent }
