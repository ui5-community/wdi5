import { wdi5Config, wdi5Selector } from "../types/wdi5.types"
import { ControlSelector } from "sap/ui/test/RecordReplay"
import { Logger as _Logger } from "./Logger"
const Logger = _Logger.getInstance()

/**
 * creates a string valid as object key from a selector
 * @param selector
 * @returns wdio_ui5_key
 */
function _createWdioUI5KeyFromSelector(selector: ControlSelector): string {
    const orEmpty = (string) => string || "-"

    const wdi5_ui5_key = `${orEmpty(selector.id)}_${orEmpty(selector.viewName)}_${orEmpty(
        selector.controlType
    )}_${orEmpty(JSON.stringify(selector.bindingPath))}_${orEmpty(JSON.stringify(selector.I18NText))}_${orEmpty(
        selector.labelFor
    )}_${orEmpty(JSON.stringify(selector.properties))}`.replace(/[^0-9a-zA-Z]+/, "")

    return wdi5_ui5_key
}

browser.addCommand("asControl", (wdi5Selector: wdi5Selector) => {
    const internalKey = wdi5Selector.wdio_ui5_key || _createWdioUI5KeyFromSelector(wdi5Selector.selector)
    // either retrieve and cache a UI5 control
    // or return a cached version
    if (!browser._controls[internalKey] || wdi5Selector.forceSelect /* always retrieve control */) {
        Logger.info(`creating internal control with id ${internalKey}`)
        const wdi5Control = {}
        browser._controls[internalKey] = wdi5Control
    } else {
        Logger.info(`reusing internal control with id ${internalKey}`)
        return browser._controls[internalKey]
    }
})
