const { browser } = require("@wdio/globals")

/**
 * @returns {string} UI5 version number in string form
 */
async function clientSide_getUI5Version(browserInstance = browser) {
    return await browserInstance.execute(() => sap.ui.version)
}

module.exports = {
    clientSide_getUI5Version
}
