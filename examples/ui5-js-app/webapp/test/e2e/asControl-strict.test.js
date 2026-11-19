const { rejects } = require("node:assert")

describe("asControl strict mode", () => {
    before(async () => {
        await browser.goTo("#/Main")
    })

    it("should retrieve an existing control with strict enabled", async () => {
        const text = await browser
            .asControl({
                strict: true,
                selector: { id: "openDialogButton", viewName: "test.Sample.view.Main" }
            })
            .getText()
        expect(text).toEqual("open Dialog")
    })

    it("should resolve every strict lookup without populating the cache", async () => {
        const selector = {
            strict: true,
            wdio_ui5_key: "uncachedStrictButton",
            selector: { id: "openDialogButton", viewName: "test.Sample.view.Main" }
        }
        const first = await browser.asControl(selector)
        const second = await browser.asControl(selector)
        const forced = await browser.asControl({ ...selector, forceSelect: true })

        expect(first.isInitialized()).toEqual(true)
        expect(second.isInitialized()).toEqual(true)
        expect(forced.isInitialized()).toEqual(true)
        expect(second).not.toBe(first)
        expect(forced).not.toBe(second)
        expect(browser._controls[selector.wdio_ui5_key]).toBeUndefined()
    })

    it("should bypass a cached initialized control without replacing it", async () => {
        const selector = {
            wdio_ui5_key: "cachedStrictButton",
            selector: { id: "openDialogButton", viewName: "test.Sample.view.Main" }
        }
        const cached = await browser.asControl(selector)
        const strict = await browser.asControl({ ...selector, strict: true })
        const forced = await browser.asControl({ ...selector, strict: true, forceSelect: true })

        expect(strict.isInitialized()).toEqual(true)
        expect(forced.isInitialized()).toEqual(true)
        expect(strict).not.toBe(cached)
        expect(forced).not.toBe(strict)
        expect(browser._controls[selector.wdio_ui5_key]).toBe(cached)
        expect(await browser.asControl({ ...selector, strict: false })).toBe(cached)
    })

    it("should resolve a newly opened dialog after a cached non-strict miss", async () => {
        const selector = {
            logging: false,
            selector: { id: "Dialog", controlType: "sap.m.Dialog", interaction: "root" }
        }
        const probe = await browser.asControl(selector)
        expect(probe.isInitialized()).toEqual(false)

        try {
            await browser.asControl({ selector: { id: "openDialogButton", viewName: "test.Sample.view.Main" } }).press()
            const control = await browser.asControl({ ...selector, strict: true })

            expect(control.isInitialized()).toEqual(true)
            expect(control).not.toBe(probe)
            expect(browser._controls[selector.wdio_ui5_key]).toBe(probe)
            expect(await browser.asControl(selector)).toBe(probe)
        } finally {
            await browser.keys("Escape")
        }
    })

    it("should fail a fluent press when the control is missing", async () => {
        await rejects(
            async () =>
                await browser
                    .asControl({
                        strict: true,
                        selector: { id: "missingStrictPressControl" }
                    })
                    .press(),
            /asControl[(][)] could not resolve a control.*missingStrictPressControl/
        )
    })

    it("should reject a still-missing control without replacing the cached non-strict miss", async () => {
        const selector = { logging: false, selector: { id: "missingCachedStrictControl" } }
        const control = await browser.asControl(selector)
        expect(control.isInitialized()).toEqual(false)
        await rejects(
            async () => await browser.asControl({ ...selector, strict: true }).press(),
            /asControl[(][)] could not resolve a control.*missingCachedStrictControl/
        )
        expect(browser._controls[selector.wdio_ui5_key]).toBe(control)
    })

    it("should reject a control in a nonexistent view (issue #625)", async () => {
        await rejects(
            async () =>
                await browser.asControl({
                    strict: true,
                    logging: false,
                    selector: { controlType: "sap.m.App", viewName: "does.not.exist" }
                }),
            /asControl[(][)] could not resolve a control.*does[.]not[.]exist/
        )
    })
})
