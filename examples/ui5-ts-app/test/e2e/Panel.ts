import Button from "sap/m/Button"
import Text from "sap/m/Text"

describe("basics", async () => {
    it("should open Panel", async () => {
        const panelButton = {
            selector: {
                controlType: "sap.m.Button",
                ancestor: {
                    controlType: "sap.m.Panel"
                }
            }
        }
        const panelControl = await browser.asControl(panelButton)
        await panelControl.press()
    })

    it("should read text from toolbar", async () => {
        const panelButton = {
            selector: {
                controlType: "sap.m.Title",
                ancestor: {
                    controlType: "sap.m.Panel"
                }
            }
        }
        const panelControl = await (browser.asControl(panelButton) as unknown as Button).getText()
        expect(panelControl).toEqual("Custom Toolbar with a header text")
    })

    it("should read text from toolbar body", async () => {
        const panelText = {
            selector: {
                controlType: "sap.m.Text",
                ancestor: {
                    controlType: "sap.m.Panel"
                }
            }
        }
        const panelControl = await (browser.asControl(panelText) as unknown as Text).getText(true)
        expect(panelControl).toEqual("Lorem ipsum dolor st amet")
    })
})
