import type { LibraryInfo } from "sap/ui/core/Core"
import type VersionInfo from "sap/ui/VersionInfo"

/**
 * @returns {string} UI5 version number in string form
 */
async function clientSide_getUI5Version(browserInstance: WebdriverIO.Browser) {
    return await browserInstance.execute(async function wdi5_getUI5Version() {
        const [VersionInfo] = await new Promise<[VersionInfo]>((resolve, reject) => {
            sap.ui.require(
                ["sap/ui/VersionInfo"],
                function (...args: [VersionInfo]) {
                    resolve(args)
                },
                reject
            )
        })
        const versionInfo = (await VersionInfo.load({ library: "sap.ui.core" })) as LibraryInfo
        return versionInfo.version
    })
}

export { clientSide_getUI5Version }
