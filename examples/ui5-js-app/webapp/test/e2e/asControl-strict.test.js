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

    it("should reject a missing control without logging", async () => {
        await rejects(
            async () =>
                await browser.asControl({
                    strict: true,
                    logging: false,
                    selector: { id: "missingStrictControl" }
                }),
            /asControl[(][)] could not resolve a control.*missingStrictControl/
        )
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

    it("should reject a cached unresolved control when strict is enabled", async () => {
        const selector = { logging: false, selector: { id: "missingCachedStrictControl" } }
        const control = await browser.asControl(selector)
        expect(control.isInitialized()).toEqual(false)
        await rejects(
            async () => await browser.asControl({ ...selector, strict: true }).press(),
            /asControl[(][)] could not resolve a control.*missingCachedStrictControl/
        )
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
