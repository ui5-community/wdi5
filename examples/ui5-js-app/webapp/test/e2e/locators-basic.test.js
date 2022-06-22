// helper class "wdi5" contained in wdio service "ui5"
const { wdi5 } = require("wdio-ui5-service")
const Main = require("./pageObjects/Main")

describe("mixed locators", () => {
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

        const control = await browser.asControl(selector)
        const retrievedClassNameStatus = await control.hasStyleClass(className)

        wdi5.getLogger().log("retrievedClassNameStatus", retrievedClassNameStatus)
        expect(retrievedClassNameStatus).toBeTruthy()
    })

    it("should find the input field on a SearchField", async () => {
        // will locate the input field
        const searchFieldSelectorInput = {
            selector: {
              controlType: "sap.m.SearchField",
              viewName,
              interaction: "focus"
            }
          }
        const placeholder = await browser.asControl(searchFieldSelectorInput)
        const placeholderText = await browser.asControl(searchFieldSelectorInput).getPlaceholder()
        expect(placeholderText).toEqual("Search...")
      })
      
      it("should find the search button on a SearchField", async () => {
        // will locate the search button (magnifier)
        const searchFieldSelectorSearchButton = {
          selector: {
            controlType: "sap.m.SearchField",
            viewName,
            interaction: "press"
          }
        }
        const searchFieldSelectorSearchButtonFocus = {
          selector: {
            controlType: "sap.m.SearchField",
            viewName,
            interaction: "focus"
          }
        }
      const searchButton = await browser.asControl(searchFieldSelectorSearchButton)
      const searchButtonFocus = await browser.asControl(searchFieldSelectorSearchButtonFocus)
      // no difference in headless log
      await searchButton.press();
      await searchButtonFocus.press();
      const webElement = await searchButton.getWebElement();
      const webElementFocus = await searchButtonFocus.getWebElement();
      // no difference in HTML
      const html = await webElement.getHTML();
      const htmlFocus = await webElementFocus.getHTML();
      // expect(searchButtonText).toEqual("Search...")

        
      })
})
