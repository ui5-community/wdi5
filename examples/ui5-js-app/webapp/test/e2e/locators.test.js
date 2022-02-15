// helper class "wdi5" contained in wdio service "ui5"
const { wdi5 } = require("wdio-ui5-service")
const Main = require("./pageObjects/Main")

describe("wdi5 locators ~ OPA5 matchers", () => {
    const viewName = "test.Sample.view.Main"

    before(async () => {
        await Main.open()
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
                viewName,
                visible: false
            }
        }
        const input = await browser.asControl(selector)
        expect(await input.getVisible()).toBe(false)

        await input.setVisible(true)
        expect(await input.getVisible()).toBe(true)
    })

    it("should find a ui5 control via .hasStyleClass", async () => {
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
                viewName,
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

    it("should find the 'open dialog' button by both property text regex options", async () => {
        const selectorByTextRegex = {
            selector: {
                controlType: "sap.m.Button",
                properties: {
                    text: new RegExp(/.*ialog.*/gm)
                }
            }
        }

        const textViaPropertyRegEx = await browser.asControl(selectorByTextRegex).getText()
        expect(textViaPropertyRegEx).toEqual("open Dialog")

        const selectorByDeclarativeRegex = {
            selector: {
                controlType: "sap.m.Button",
                properties: {
                    text: {
                        regex: {
                            source: ".*ialog.*",
                            flags: "gm"
                        }
                    }
                }
            }
        }
        const textViaDeclarative = await browser.asControl(selectorByDeclarativeRegex).getText()
        expect(textViaDeclarative).toEqual("open Dialog")
    })

    describe.only("RegEx notations", () => {
        /**
         * click the open dialog button to (well) open a dialog
         * @param {String|RegExp} idRegex
         */
        async function _assert(idRegex) {
            const openButtonSelector = {
                forceSelect: true, // make sure we're retrieving from scratch
                selector: {
                    id: idRegex
                }
            }

            const dialogSelector = {
                forceSelect: true,
                selector: {
                    id: "Dialog",
                    controlType: "sap.m.Dialog",
                    interaction: "root"
                }
            }

            if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
                openButtonSelector.forceSelect = true
                openButtonSelector.selector.interaction = "root"
            }

            // await browser.asControl(openButtonSelector).firePress()
            // await browser.asControl(openButtonSelector).getWebElement().click()
            // const button = await browser.asControl(openButtonSelector)
            // const $button = await browser.asControl(openButtonSelector).getWebElement()
            // await $button.click()
            const button = await browser.asControl(openButtonSelector)
            await button.press()

            // await browser.asControl(openButtonSelector).press()

            // await browser.asControl(openButtonSelector).getWebElement().click()

            const popup = await browser.asControl(dialogSelector)
            await expect(await popup.getVisible()).toBeTruthy()
        }

        afterEach(() => {
            browser.keys("Escape") // close popup
        })

        it("plain regex /.../", async () => {
            return await _assert(/.*openDialogButton$/)
        })
    })
})
