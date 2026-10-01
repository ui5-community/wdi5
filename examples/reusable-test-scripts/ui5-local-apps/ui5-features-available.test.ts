import { mock } from "node:test"
import _ui5Service from "wdio-ui5-service"

/**
 * The tsdown generated .cjs test files expects require("wdio-ui5-service").default.
 * Files .ts and .js are fine.
 */
// @ts-expect-error: Property 'default' does not exist on type 'typeof Service'.
const ui5Service = typeof _ui5Service?.default === "function" ? new _ui5Service.default() : new _ui5Service()

/**
 * All tests have the same setup and initial assertions
 */
async function setupMockInjectAssert(ui5Version) {
    let ui5Features = await browser.execute(() => window.wdi5Ui5FeaturesAvailable)
    expect(ui5Features).toBeUndefined()
    const browserMock = mock.method(browser, "getUI5Version", () => ui5Version)
    await ui5Service.injectUI5()
    browserMock.mock.restore()
    ui5Features = await browser.execute(() => window.wdi5Ui5FeaturesAvailable)
    expect(ui5Features.version).toBe(ui5Version)
    return ui5Features
}

describe("ui5 features available", () => {
    beforeEach(async () => {
        // Start fresh every test
        await browser.url(globalThis.localhostUrl)
    })

    it("should show UI5 features available for the UI5 v1.71", async () => {
        const ui5Features = await setupMockInjectAssert("1.71.0")
        expect(ui5Features.useFetchWaiter).toBeFalsy()
        expect(ui5Features.useGetComponentById).toBeFalsy()
        expect(ui5Features.useUI5ElementClosestTo).toBeFalsy()
        expect(ui5Features.useOldHashChanger).toBeTruthy()
        expect(ui5Features.useOldDoubleLeadingSlash).toBeTruthy()
        expect(ui5Features.useOldMatcherAPI).toBeTruthy()
    })

    it("should show UI5 features available for the UI5 v1.74", async () => {
        const ui5Features = await setupMockInjectAssert("1.74.0")
        expect(ui5Features.useFetchWaiter).toBeFalsy()
        expect(ui5Features.useGetComponentById).toBeFalsy()
        expect(ui5Features.useUI5ElementClosestTo).toBeFalsy()
        expect(ui5Features.useOldHashChanger).toBeTruthy()
        expect(ui5Features.useOldDoubleLeadingSlash).toBeTruthy()
        expect(ui5Features.useOldMatcherAPI).toBeFalsy()
    })

    it("should show UI5 features available for the UI5 v1.80", async () => {
        const ui5Features = await setupMockInjectAssert("1.80.0")
        expect(ui5Features.useFetchWaiter).toBeFalsy()
        expect(ui5Features.useGetComponentById).toBeFalsy()
        expect(ui5Features.useUI5ElementClosestTo).toBeFalsy()
        expect(ui5Features.useOldHashChanger).toBeFalsy()
        expect(ui5Features.useOldDoubleLeadingSlash).toBeTruthy()
        expect(ui5Features.useOldMatcherAPI).toBeFalsy()
    })

    it("should show UI5 features available for the UI5 v1.107", async () => {
        const ui5Features = await setupMockInjectAssert("1.107.0")
        expect(ui5Features.useFetchWaiter).toBeFalsy()
        expect(ui5Features.useGetComponentById).toBeFalsy()
        expect(ui5Features.useUI5ElementClosestTo).toBeFalsy()
        expect(ui5Features.useOldHashChanger).toBeFalsy()
        expect(ui5Features.useOldDoubleLeadingSlash).toBeFalsy()
        expect(ui5Features.useOldMatcherAPI).toBeFalsy()
    })

    it("should show UI5 features available for the UI5 v1.113", async () => {
        const ui5Features = await setupMockInjectAssert("1.113.0")
        expect(ui5Features.useFetchWaiter).toBeFalsy()
        expect(ui5Features.useGetComponentById).toBeFalsy()
        expect(ui5Features.useUI5ElementClosestTo).toBeTruthy()
        expect(ui5Features.useOldHashChanger).toBeFalsy()
        expect(ui5Features.useOldDoubleLeadingSlash).toBeFalsy()
        expect(ui5Features.useOldMatcherAPI).toBeFalsy()
    })

    it("should show UI5 features available for the UI5 v1.119", async () => {
        const ui5Features = await setupMockInjectAssert("1.119.0")
        expect(ui5Features.useFetchWaiter).toBeTruthy()
        expect(ui5Features.useGetComponentById).toBeFalsy()
        expect(ui5Features.useUI5ElementClosestTo).toBeTruthy()
        expect(ui5Features.useOldHashChanger).toBeFalsy()
        expect(ui5Features.useOldDoubleLeadingSlash).toBeFalsy()
        expect(ui5Features.useOldMatcherAPI).toBeFalsy()
    })

    it("should show UI5 features available for the UI5 v1.136", async () => {
        const ui5Features = await setupMockInjectAssert("1.136.0")
        expect(ui5Features.useFetchWaiter).toBeTruthy()
        expect(ui5Features.useGetComponentById).toBeTruthy()
        expect(ui5Features.useUI5ElementClosestTo).toBeTruthy()
        expect(ui5Features.useOldHashChanger).toBeFalsy()
        expect(ui5Features.useOldDoubleLeadingSlash).toBeFalsy()
        expect(ui5Features.useOldMatcherAPI).toBeFalsy()
    })
})
