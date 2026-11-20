import _ui5Service from "wdio-ui5-service"

/**
 * The tsdown generated .cjs test files expects require("wdio-ui5-service").default.
 * Files .ts and .js are fine.
 */
// @ts-expect-error: Property 'default' does not exist on type 'typeof Service'.
const ui5Service = typeof _ui5Service?.default === "function" ? new _ui5Service.default() : new _ui5Service()

describe("ui5 basic", () => {
    it('should show a non UI5 page, then advance to a UI5 page and late init "wdi5"', async () => {
        // native wdio functionality - navigates to the wdi5 github page
        const link = await $("=wdi5")
        await expect(link).toHaveText("wdi5")
        // open local app
        await browser.url(globalThis.localhostUrl)
        let hasWdi5InBrowser = await browser.execute(() => !!window.wdi5)
        expect(hasWdi5InBrowser).toBeFalsy()

        // do the late injection
        await ui5Service.injectUI5()
        hasWdi5InBrowser = await browser.execute(() => !!window.wdi5)
        expect(hasWdi5InBrowser).toBeTruthy()
    })

    it("should verify the caching of the wdi5 config", async () => {
        // open local app
        await browser.url(globalThis.localhostUrl)
        // do the late injection
        await ui5Service.injectUI5()
        // check if config have been cached
        expect(globalThis.__wdi5Config.wdi5.waitForUI5Timeout).toBe(654321)
    })

    // after late injection, use wdi5 as usual
    it("should get a button text via model binding", async () => {
        const buttonText = await (
            browser.asControl({
                selector: {
                    bindingPath: {
                        modelName: "testModel",
                        propertyPath: "/buttonText"
                    },
                    viewName: "test.Sample.view.Main",
                    controlType: "sap.m.Button"
                }
            }) as any
        ).getText()

        expect(buttonText).toContain("press me")
    })
})
