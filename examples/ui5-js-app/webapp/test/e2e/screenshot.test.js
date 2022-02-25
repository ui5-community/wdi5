const fs = require("fs/promises")
const path = require("path")
const Main = require("./pageObjects/Main")

describe("screenshots (async tests)", () => {
    before(async () => {
        await Main.open()
    })
    it("should validate screenshots capability", async () => {
        await browser.screenshot("ui5-page")

        // seed to wait some time until the screenshot is actually saved to the file system before reading it again
        setTimeout(async () => {
            const screenShotPath = path.join("examples", "ui5-js-app", "webapp", "test", "__screenshots__")
            const screenshots = await fs.readdir(screenShotPath)
            const ours = screenshots.find((shot) => shot.match(/.*ui5-page.*/))
            expect(ours).toMatch(/.*ui5-page.*/)
        }, 500)
    })

    it("should validate screenshots capability with unnamed screenshot", async () => {
        await browser.screenshot()

        // seed to wait some time until the screenshot is actually saved to the file system before reading it again
        setTimeout(async () => {
            const screenShotPath = path.join("examples", "ui5-js-app", "webapp", "test", "__screenshots__")
            const screenshots = fs.readdirSync(screenShotPath)
            const ours = screenshots.find((shot) => shot.match(/.*-screenshot.png/))
            expect(ours).toMatch(/.*-screenshot.png/)
        }, 500)
    })
})
