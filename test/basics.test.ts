import { wdi5Config } from "../src/lib/types"

describe("basics", () => {
    it("should have the right title", async () => {
        const title = await browser.getTitle()
        await expect(title).toEqual("OpenUI5 SDK - Demo Kit")
    })
})
