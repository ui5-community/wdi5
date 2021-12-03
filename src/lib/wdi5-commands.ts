import { wdi5Config, wdi5Selector } from "../types/wdi5.types"
import { ControlSelector } from "sap/ui/test/RecordReplay"
import { Logger as _Logger } from "./Logger"
const Logger = _Logger.getInstance()

/**
 * creates a string valid as object key from a selector
 * @param selector
 * @returns wdio_ui5_key
 */
function _createWdioUI5KeyFromSelector(selector: wdi5Selector): string {
    const orEmpty = (string) => string || "-"

    const _selector = selector.selector
    const wdi5_ui5_key = `${orEmpty(_selector.id)}_${orEmpty(_selector.viewName)}_${orEmpty(
        _selector.controlType
    )}_${orEmpty(JSON.stringify(_selector.bindingPath))}_${orEmpty(JSON.stringify(_selector.I18NText))}_${orEmpty(
        _selector.labelFor
    )}_${orEmpty(JSON.stringify(_selector.properties))}`.replace(/[^0-9a-zA-Z]+/, "")

    return wdi5_ui5_key
}

export function addWdi5Commands() {
    browser.addCommand("asControl", async (wdi5Selector: wdi5Selector) => {
        const internalKey = wdi5Selector.wdio_ui5_key || _createWdioUI5KeyFromSelector(wdi5Selector)
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
}
