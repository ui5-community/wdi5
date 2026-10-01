import type Panel from "sap/m/Panel"
import type DateTimePicker from "sap/m/DateTimePicker"
import type Title from "sap/m/Title"
import type Button from "sap/m/Button"
import Main from "./pageObjects/Main.js"
import { wdi5 } from "wdio-ui5-service"

describe("ui5 matcher tests", () => {
    before(async () => {
        await Main.open()
    })

    it("check descendant matcher for panel", async () => {
        const descendantSelector = {
            selector: {
                controlType: "sap.m.Panel",
                descendant: {
                    // viewName: "test.Sample.view.Main",
                    controlType: "sap.m.Title",
                    properties: {
                        text: "Custom Toolbar with a header text"
                    }
                }
            }
        }

        const panel = (await browser.asControl(descendantSelector)) as unknown as Panel

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

        const datePicker = (await browser.asControl(labelForSelector)) as unknown as DateTimePicker

        const sDatePickerPlaceholder = await datePicker.getPlaceholder()
        expect(sDatePickerPlaceholder).toEqual("Enter Date ...")
    })

    it("check anchestor matcher", async () => {
        const ancestorSelector = {
            selector: {
                controlType: "sap.m.Title",
                ancestor: {
                    // viewName: "test.Sample.view.Main",
                    controlType: "sap.m.Panel"
                }
            }
        }

        const title = (await browser.asControl(ancestorSelector)) as unknown as Title

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

        const button = (await browser.asControl(siblingsSelector)) as unknown as Button

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

        const button = (await browser.asControl(siblingsSelector)) as unknown as Button

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

        const button = (await browser.asControl(interactableSelector)) as unknown as Button

        const sButtonStatus = await button.getEnabled()
        const text = await button.getText()
        wdi5.getLogger("interactable").log(`//> button text is ${text}`)
        expect(sButtonStatus).toBeTruthy()
    })

    it.skip("check non-interactable matcher", async () => {
        const notInteractableSelector = {
            selector: {
                controlType: "sap.m.Button",
                viewName: "test.Sample.view.Main",
                interactable: false
            }
        }

        // @ts-expect-error
        const text = await browser.asControl(notInteractableSelector).getText()

        expect(text).toBe("can't click :(")
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
