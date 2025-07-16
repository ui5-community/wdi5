import type { LibraryInfo } from "sap/ui/core/Core"
import type VersionInfo from "sap/ui/VersionInfo"

/**
 * @returns {string} UI5 version number in string form
 */
async function clientSide_getUI5Version(browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async () => {
        return await new Promise<string>((resolve) => {
            sap.ui.require(["sap/ui/VersionInfo"], async (VersionInfo: VersionInfo) => {
                const versionInfo = (await VersionInfo.load()) as LibraryInfo
                resolve(versionInfo.version)
            })
        })
    })
}

export { clientSide_getUI5Version }
