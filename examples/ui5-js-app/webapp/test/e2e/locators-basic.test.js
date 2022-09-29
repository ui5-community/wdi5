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

    // #291
    it("should find a sap.m.Select and get an entry", async () => {
        const selector = {
            selector: {
                interaction: "root",
                controlType: "sap.m.Select",
                viewName
            }
        }
        /**
         * @type {import("sap/m/Select").default}
         */
        const select = await browser.asControl(selector)
        await select.open() // <- meh, but needed to have the select items in the DOM
        // alternative:
        // await browser.asControl({
        //     "controlType": "sap.m.Select"
        //      "interaction": {
        //          "idSuffix": "arrow"
        //      }
        //  }).press()
        const selectedItem = await select.getSelectedItem()
        const text = await selectedItem.getText()
        expect(text).toEqual("Algeria")

        const textViaFluentApi = await browser.asControl(selector).getSelectedItem().getText()
        expect(textViaFluentApi).toEqual("Algeria")
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
        const placeholderText = await placeholder.getPlaceholder()
        expect(placeholderText).toEqual("Search...")
    })

    it("should operate a SearchField via OPA5-compatible press- and focus-interaction", async () => {
        // will locate the search button (magnifier)
        const searchFieldSelectorSearchButton = {
            selector: {
                id: "idSearchfield",
                viewName,
                interaction: "press"
            }
        }

        const searchFieldSelectorSearchButtonFocus = {
            forceSelect: true,
            selector: {
                controlType: "sap.m.SearchField",
                viewName,
                interaction: "focus"
            }
        }

        const searchResult = {
            forceSelect: true,
            selector: {
                id: "idSearchResult",
                viewName
            }
        }

        const searchText1 = "mySearch"
        const searchText2 = "mySearch again"

        // no "search" triggered yet
        const emptyResult = await browser.asControl(searchResult).getText()
        expect(emptyResult).toEqual("")

        // enter searchterm via regular api
        const searchField = await browser.asControl(searchFieldSelectorSearchButtonFocus)
        await searchField.enterText(searchText1)
        const nonEmptyResult1 = await browser.asControl(searchResult).getText()
        expect(nonEmptyResult1).toEqual(searchText1)

        // enter searchterm via fluent api
        await browser.asControl(searchFieldSelectorSearchButtonFocus).enterText(searchText2)
        const nonEmptyResult2 = await browser.asControl(searchResult).getText()
        expect(nonEmptyResult2).toEqual(searchText2)

        // trigger search via fluent api
        const searchText3 = "click1"
        await browser.asControl(searchFieldSelectorSearchButtonFocus).setValue(searchText3)
        await browser.asControl(searchFieldSelectorSearchButton).press()
        const nonEmptyResult3 = await browser.asControl(searchResult).getText()
        expect(nonEmptyResult3).toEqual(searchText3)

        // trigger search via regular api
        const searchText4 = "click2"
        await browser.asControl(searchFieldSelectorSearchButtonFocus).setValue(searchText4)
        const button = await browser.asControl(searchFieldSelectorSearchButton)
        await button.press()
        const nonEmptyResult4 = await browser.asControl(searchResult).getText()
        expect(nonEmptyResult4).toEqual(searchText4)
    })
})
