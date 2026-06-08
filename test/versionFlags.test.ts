import { strictEqual } from "node:assert"
import { clientSide_injectXHRPatch } from "../src/client-side-js/injectXHRPatch"
import { clientSide_injectUI5 } from "../src/client-side-js/injectUI5"

/**
 * Builds a mock browser that captures the arguments passed to `execute`.
 * The injected function is never actually run — we only care about what
 * version-derived booleans the Node.js side computes and passes in.
 */
function makeMockBrowser(ui5Version: string) {
    let capturedArgs: unknown[] = []
    return {
        getUI5Version: async () => ui5Version,
        execute: async (_fn: unknown, ...args: unknown[]) => {
            capturedArgs = args
            return true
        },
        setTimeout: async () => {},
        get capturedArgs() {
            return capturedArgs
        }
    }
}

describe("version flag computation (Node.js side)", function () {
    describe("clientSide_injectXHRPatch", function () {
        it("passes hasFetchWaiter=true for UI5 > 1.114.0", async function () {
            const browser = makeMockBrowser("1.120.0")
            await clientSide_injectXHRPatch({} as never, browser as never)
            // args: [wdi5Config, hasFetchWaiter]
            strictEqual(browser.capturedArgs[1], true)
        })

        it("passes hasFetchWaiter=false for UI5 <= 1.114.0", async function () {
            const browser = makeMockBrowser("1.114.0")
            await clientSide_injectXHRPatch({} as never, browser as never)
            strictEqual(browser.capturedArgs[1], false)
        })

        it("passes hasFetchWaiter=false for UI5 < 1.114.0", async function () {
            const browser = makeMockBrowser("1.96.0")
            await clientSide_injectXHRPatch({} as never, browser as never)
            strictEqual(browser.capturedArgs[1], false)
        })
    })

    describe("clientSide_injectUI5", function () {
        // args order: [waitForUI5Timeout, useClosestTo, useOldMatcherAPI, needsDoubleLeadingSlash]

        it("modern UI5 (1.120): useClosestTo=true, useOldMatcherAPI=false, needsDoubleLeadingSlash=false", async function () {
            const browser = makeMockBrowser("1.120.0")
            await clientSide_injectUI5(10000, browser as never)
            const [, useClosestTo, useOldMatcherAPI, needsDoubleLeadingSlash] = browser.capturedArgs
            strictEqual(useClosestTo, true)
            strictEqual(useOldMatcherAPI, false)
            strictEqual(needsDoubleLeadingSlash, false)
        })

        it("UI5 1.96: useClosestTo=false, useOldMatcherAPI=false, needsDoubleLeadingSlash=false", async function () {
            const browser = makeMockBrowser("1.96.0")
            await clientSide_injectUI5(10000, browser as never)
            const [, useClosestTo, useOldMatcherAPI, needsDoubleLeadingSlash] = browser.capturedArgs
            strictEqual(useClosestTo, false)
            strictEqual(useOldMatcherAPI, false)
            strictEqual(needsDoubleLeadingSlash, false)
        })

        it("UI5 1.80: useClosestTo=false, useOldMatcherAPI=false, needsDoubleLeadingSlash=true", async function () {
            const browser = makeMockBrowser("1.80.0")
            await clientSide_injectUI5(10000, browser as never)
            const [, useClosestTo, useOldMatcherAPI, needsDoubleLeadingSlash] = browser.capturedArgs
            strictEqual(useClosestTo, false)
            strictEqual(useOldMatcherAPI, false)
            strictEqual(needsDoubleLeadingSlash, true)
        })

        it("very old UI5 (1.60): useClosestTo=false, useOldMatcherAPI=true, needsDoubleLeadingSlash=true", async function () {
            const browser = makeMockBrowser("1.60.0")
            await clientSide_injectUI5(10000, browser as never)
            const [, useClosestTo, useOldMatcherAPI, needsDoubleLeadingSlash] = browser.capturedArgs
            strictEqual(useClosestTo, false)
            strictEqual(useOldMatcherAPI, true)
            strictEqual(needsDoubleLeadingSlash, true)
        })
    })
})
