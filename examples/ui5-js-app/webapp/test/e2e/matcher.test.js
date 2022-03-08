const Main = require("./pageObjects/Main")

describe("ui5 matcher tests", () => {
    before(async () => {
        await Main.open()
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

    it("check descendant matcher for panel", async () => {
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

    // TODO:
    it.only("check labelFor matcher ", async () => {
        const descendantSelector = {
            selector: {
                controlType: "sap.m.Panel",
                labelFor: {
                    text: "string",
                    modelName: "string",
                    key: "string",
                    parameters: "any",
                    propertyName: "string"
                }
            }
        }

        const panel = await browser.asControl(descendantSelector)

        const sPanelText = await panel.getHeaderText()
        expect(sPanelText).toEqual("Header Text")

        const bPanelExpandable = await panel.getExpandable()
        expect(bPanelExpandable).toEqual(true)
    })

    // TODO:
    it.only("check anchestor matcher", async () => {
        const descendantSelector = {
            selector: {
                controlType: "sap.m.Panel",
                ancestor: "object" // where "object" is a declarative matcher for the ancestor
            }
        }

        const panel = await browser.asControl(descendantSelector)

        const sPanelText = await panel.getHeaderText()
        expect(sPanelText).toEqual("Header Text")

        const bPanelExpandable = await panel.getExpandable()
        expect(bPanelExpandable).toEqual(true)
    })
})
