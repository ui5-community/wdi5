import fs from "node:fs/promises"
import Main from "./pageObjects/Main.js"

describe("screenshots (async tests)", () => {
    let screenshotPath: string

    before(async () => {
        const configuredScreenshotPath = globalThis.__wdi5Config.wdi5?.screenshotPath
        if (!configuredScreenshotPath) {
            throw new Error("wdi5.screenshotPath must be configured for screenshot tests")
        }
        screenshotPath = configuredScreenshotPath
        await Main.open()
    })

    it("should validate screenshots capability", async () => {
        const screenshotsBefore = new Set(await fs.readdir(screenshotPath))
        await browser.screenshot("ui5-page")
        const screenshots = await fs.readdir(screenshotPath)
        const createdScreenshot = screenshots.find(
            (screenshot) => !screenshotsBefore.has(screenshot) && screenshot.includes("ui5-page")
        )
        expect(createdScreenshot).toBeDefined()
    })

    it("should validate screenshots capability with unnamed screenshot", async () => {
        const screenshotsBefore = new Set(await fs.readdir(screenshotPath))
        // @ts-expect-error
        await browser.screenshot()
        const screenshots = await fs.readdir(screenshotPath)
        const createdScreenshot = screenshots.find(
            (screenshot) => !screenshotsBefore.has(screenshot) && screenshot.endsWith("-screenshot.png")
        )
        expect(createdScreenshot).toBeDefined()
    })
})
