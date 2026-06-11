import type { ui5FeaturesAvailable } from "../types/wdi5.types.js"

async function clientSide_setUI5FeaturesAvailable(
    ui5FeaturesAvailable: ui5FeaturesAvailable,
    browserInstance: WebdriverIO.Browser
) {
    return await browserInstance.execute(async function wdi5_setUI5FeaturesAvailable(
        ui5FeaturesAvailableNode: ui5FeaturesAvailable
    ) {
        window.wdi5Ui5FeaturesAvailable = ui5FeaturesAvailableNode
    }, ui5FeaturesAvailable)
}

export { clientSide_setUI5FeaturesAvailable }
