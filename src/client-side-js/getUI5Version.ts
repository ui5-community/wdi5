/**
 * @returns {string} UI5 version number in string form
 */
async function clientSide_getUI5Version(browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(() => sap.ui.version)
}

export { clientSide_getUI5Version }
