const Main = require("./pageObjects/Main")

describe("ui5 basic", () => {
    before(async () => {
        await Main.open()
    })

    it("should have the right title", async () => {
        const title = await browser.getTitle()
        expect(title).toEqual("Sample UI5 Application")
    })

    // #118
    it.skip("should use a control selector with dots and colons", async () => {
        const selector = {
            selector: {
                id: "Title::NoAction.h1",
                viewName: "test.Sample.view.Main"
            }
        }

        // ui5
        const titleWUi5 = await browser.asControl(selector).getText()

        // working webdriver example with xpath id selector
        const titleElement = await $('//*[@id="container-Sample---Main--Title::NoAction.h1"]')
        const titleWwdio = await titleElement.getText()

        expect(titleWUi5).toEqual("UI5 demo")
        expect(titleWwdio).toEqual("UI5 demo")
    })

    it.skip("check for invalid control selector", async () => {
        const selector1 = {
            selector_: {
                test: "some.test.string"
            }
        }

        const selector2 = {
            id: "some.test.string"
        }

        const invalidControl1 = await browser.asControl(selector1)
        const invalidControl2 = await browser.asControl(selector2)

        // check if result contains the expected validation error
        expect(invalidControl1).toContain("ERROR")
        expect(invalidControl2).toContain("ERROR")
    })

    it("check i18nText Button matcher", async () => {
        const i18nSelector = {
            // wdio_ui5_key: "nav_button",
            selector: {
                i18NText: {
                    propertyName: "text",
                    key: "startPage.navButton.text"
                },
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main"
            }
        }

        const button = await browser.asControl(i18nSelector)
        const buttonText = await button.getText()
        expect(buttonText).toEqual("to Other view")
    })

    it("check i18nText matcher user button", async () => {
        const i18nSelector = {
            // wdio_ui5_key: "user_button",
            selector: {
                i18NText: {
                    propertyName: "text",
                    key: "startPage.userButton.text"
                },
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main"
            }
            // forceSelect: true
        }

        const button = await browser.asControl(i18nSelector)
        const buttonText = await button.getText()
        expect(buttonText).toEqual("User Test Text")
    })

    it.only("check i18nText matcher user button", async () => {
        const descendantSelector = {
            selector: {
                controlType: "sap.m.Panel",
                descendant: {
                    viewName: "test.Sample.view.Main",
                    controlType: "sap.m.Title",
                    properties: {
                        text: "Custom Toolbar with a header text"
                    }
                }
            }
        }

        const panel = await browser.asControl(descendantSelector)

        const sPanelText = await panel.getHeaderText()
        expect(sPanelText).toEqual("Header Text")

        const bPanelExpandable = await panel.getExpandable()
        expect(bPanelExpandable).toEqual(true)
    })
})
