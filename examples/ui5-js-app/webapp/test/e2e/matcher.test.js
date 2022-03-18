const Main = require("./pageObjects/Main")

describe("ui5 matcher tests", () => {
    before(async () => {
        await Main.open()
    })

    it("check i18nText Button matcher", async () => {
        const i18nSelector = {
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
            selector: {
                i18NText: {
                    propertyName: "text",
                    key: "startPage.userButton.text"
                },
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main"
            }
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

    it("check labelFor matcher ", async () => {
        const labelForSelector = {
            selector: {
                controlType: "sap.m.DateTimePicker",
                labelFor: {
                    text: "labelFor DateTimePicker"
                }
            }
        }

        const datePicker = await browser.asControl(labelForSelector)

        const sDatePickerPlaceholder = await datePicker.getPlaceholder()
        expect(sDatePickerPlaceholder).toEqual("Enter Date ...")
    })

    it("check anchestor matcher", async () => {
        const ancestorSelector = {
            selector: {
                controlType: "sap.m.Title",
                ancestor: {
                    viewName: "test.Sample.view.Main",
                    controlType: "sap.m.Panel"
                }
            }
        }

        const title = await browser.asControl(ancestorSelector)

        const sTitleText = await title.getText()
        expect(sTitleText).toEqual("Custom Toolbar with a header text")
    })

    it("check siblings matcher first Occurance", async () => {
        const siblingsSelector = {
            selector: {
                controlType: "sap.m.Button",
                sibling: {
                    viewName: "test.Sample.view.Main",
                    controlType: "sap.m.Button",
                    properties: {
                        text: "open Barcodescanner"
                    }
                }
            }
        }

        const button = await browser.asControl(siblingsSelector)

        const sButtonText = await button.getText()
        expect(sButtonText).toEqual("to Other view")
    })

    // TODO: ciblings matacher with options parameter
    it.skip("check siblings matcher next Occurance", async () => {
        const siblingsSelector = {
            selector: {
                controlType: "sap.m.Button",
                sibling: {
                    viewName: "test.Sample.view.Main",
                    controlType: "sap.m.Button",
                    properties: {
                        text: "open Barcodescanner"
                    },
                    options: {
                        next: true
                    }
                }
            }
        }

        const button = await browser.asControl(siblingsSelector)

        const sButtonText = await button.getText()
        expect(sButtonText).toEqual("open Dialog")
    })

    it("check interactable matcher", async () => {
        const interactableSelector = {
            selector: {
                controlType: "sap.m.Button",
                interactable: true,
                visible: true
            }
        }

        const button = await browser.asControl(interactableSelector)

        const sButtonStatus = await button.getEnabled()
        expect(sButtonStatus).toBeTruthy()
    })

    // #131
    /* it("check for Searchfield Properties", async () => {
        const searchFieldSelector = {
            selector: {
                // id: "idSearchfield",
                viewName: "test.Sample.view.Main",
                interactable: true,
                visible: true,
                controlType: "sap.m.SearchField"
            }
        }

        expect(await browser.asControl(searchFieldSelector).getValue()).toEqual("search Value")
    }) */
})
