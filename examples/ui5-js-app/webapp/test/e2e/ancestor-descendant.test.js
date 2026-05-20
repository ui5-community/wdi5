const Main = require("./pageObjects/Main")

describe("ancestor and descendant selector resolution", () => {
    before(async () => {
        await Main.open()
    })

    it("should find a control using an ancestor selector (asControl)", async () => {
        const selector = {
            selector: {
                controlType: "sap.m.Title",
                ancestor: {
                    controlType: "sap.m.Panel",
                    properties: {
                        headerText: "Header Text"
                    }
                }
            }
        }
        const title = await browser.asControl(selector)
        expect(await title.getText()).toBe("Custom Toolbar with a header text")
    })

    it("should find a control using a descendant selector (asControl)", async () => {
        const selector = {
            selector: {
                controlType: "sap.m.Panel",
                descendant: {
                    controlType: "sap.m.Title",
                    properties: {
                        text: "Custom Toolbar with a header text"
                    }
                }
            }
        }
        const panel = await browser.asControl(selector)
        expect(await panel.getHeaderText()).toBe("Header Text")
    })

    it("should find all controls using an ancestor selector (allControls)", async () => {
        const selector = {
            wdio_ui5_key: "allButtonsWithAncestor",
            selector: {
                controlType: "sap.m.Button",
                ancestor: {
                    id: "page",
                    viewName: "test.Sample.view.Main"
                }
            }
        }
        const buttons = await browser.allControls(selector)
        expect(Array.isArray(buttons)).toBe(true)
        expect(buttons.length).toBe(9)
    })

    it("should find all controls using a descendant selector (allControls)", async () => {
        const selector = {
            wdio_ui5_key: "allPanelsWithDescendant",
            selector: {
                controlType: "sap.m.Panel",
                descendant: {
                    controlType: "sap.m.Title",
                    properties: {
                        text: "Custom Toolbar with a header text"
                    }
                }
            }
        }
        const panels = await browser.allControls(selector)
        expect(Array.isArray(panels)).toBe(true)
        expect(panels.length).toBe(1)
        expect(await panels[0].getHeaderText()).toBe("Header Text")
    })

    it("should find a control using nested ancestor/descendant selectors", async () => {
        // Find the Title inside the Panel, which is inside the Page
        const selector = {
            selector: {
                controlType: "sap.m.Title",
                properties: {
                    text: "Custom Toolbar with a header text"
                },
                ancestor: {
                    controlType: "sap.m.Panel",
                    ancestor: {
                        id: "page",
                        viewName: "test.Sample.view.Main"
                    }
                }
            }
        }
        const title = await browser.asControl(selector)
        expect(await title.getText()).toBe("Custom Toolbar with a header text")
    })
})
