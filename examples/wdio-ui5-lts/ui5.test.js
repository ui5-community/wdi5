import { browser } from "@wdio/globals"
import { wdi5 } from "wdio-ui5-service"

const ui5VersionArgument = process.argv.find((argument) => argument.includes("--ui5=")).split("=")[1]

describe(`ui5 basic v${ui5VersionArgument}`, () => {
    it("should get the UI5 version from the CLI arguments", async () => {
        const [ui5VersionArgumentMajor, ui5VersionArgumentMinor, ui5VersionArgumentPatch] =
            ui5VersionArgument.split(".")
        const ui5VersionBrowser = await browser.getUI5Version()
        const [ui5VersionBrowserMajor, ui5VersionBrowserMinor, ui5VersionBrowserPatch] = ui5VersionBrowser.split(".")
        const logger = wdi5.getLogger()
        logger.log(`Browser URL: ${await browser.getUrl()}`)
        logger.log(`UI5 version running in the browser: ${ui5VersionBrowser}`)
        logger.log(`UI5 version set via CLI arguments: ${ui5VersionArgument}`)
        expect(ui5VersionBrowserMajor).toEqual(ui5VersionArgumentMajor)
        expect(ui5VersionBrowserMinor).toEqual(ui5VersionArgumentMinor)
    })
})
