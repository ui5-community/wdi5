const { wdi5 } = require("wdio-ui5-service")
const Main = require("./pageObjects/Main")

describe("ui5 basic", () => {
    globalThis.viewName = "test.Sample.view.Main"

    before(async () => {
        await Main.open()
    })

    beforeEach(async () => {
        wdi5.getLogger().log("beforeEach")
        await browser.screenshot("test-basic")
    })

    // TODO: make this work -> see #106
    it.skip("should find a control with visible: false", async () => {
        const id = "invisibleInputField"

        // wdio-native selector
        const wdioInput = await browser.$(`[id$="${id}"]`)
        expect(await wdioInput.getProperty("id")).toContain("sap-ui-invisible")

        const selector = {
            selector: {
                id,
                controlType: "sap.m.Input",
                viewName: globalThis.viewName,
                visible: false
            }
        }
        const input = await browser.asControl(selector)
        expect(await input.getVisible()).toBe(false)

        await input.setVisible(true)
        expect(await input.getVisible()).toBe(true)
    })

    it("should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Sample UI5 Application")
    })

    it("should find a ui5 control class via .hasStyleClass", async () => {
        // webdriver
        const className = "myTestClass"

        // ui5
        const selector = {
            wdio_ui5_key: "buttonSelector",
            selector: {
                bindingPath: {
                    modelName: "testModel",
                    propertyPath: "/buttonText"
                },
                viewName: globalThis.viewName,
                controlType: "sap.m.Button"
            }
        }

        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            selector.forceSelect = true
            selector.selector.interaction = "root"
        }

        const control = await browser.asControl(selector)
        const retrievedClassNameStatus = await control.hasStyleClass(className)

        wdi5.getLogger().log("retrievedClassNameStatus", retrievedClassNameStatus)
        expect(retrievedClassNameStatus).toBeTruthy()
    })
})
