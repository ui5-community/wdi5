import { switchToTopFrame } from "../src/lib/frames.js"
import { deepStrictEqual, rejects } from "node:assert"

function browserWithSwitchFrame(switchFrame: (context: unknown) => Promise<void>) {
    return { switchFrame } as unknown as WebdriverIO.Browser
}

describe("switchToTopFrame", function () {
    it("should resolve when switchFrame resolves", async function () {
        const contexts: unknown[] = []
        const browserInstance = browserWithSwitchFrame(async (context) => {
            contexts.push(context)
        })
        await switchToTopFrame(browserInstance)
        deepStrictEqual(contexts, [null])
    })

    it("should swallow the v10 BiDi switchFrame error", async function () {
        const browserInstance = browserWithSwitchFrame(async () => {
            throw new Error(
                "`switchFrame` was removed for WebDriver BiDi sessions in WebdriverIO v10. Call `frame()` on the browsing context."
            )
        })
        await switchToTopFrame(browserInstance)
    })

    it("should rethrow any other error unchanged", async function () {
        const error = new Error("session deleted")
        const browserInstance = browserWithSwitchFrame(async () => {
            throw error
        })
        await rejects(switchToTopFrame(browserInstance), (err) => err === error)
    })
})
