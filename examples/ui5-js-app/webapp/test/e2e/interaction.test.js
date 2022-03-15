const Main = require("./pageObjects/Main")

describe("interaction + binding", () => {
    const viewName = "test.Sample.view.Main"

    before(async () => {
        await Main.open()
    })

    it("select ui5 input control by binding and set new value (w/ custom wdio_ui5_key)", async () => {
        const newUsername = "my New Username"
        const inputSelector = {
            forceSelect: true,
            wdio_ui5_key: "mainUserInput",
            selector: {
                interaction: "focus",
                bindingPath: {
                    propertyPath: "/Customers('TRAIH')/ContactName"
                },
                viewName: viewName,
                controlType: "sap.m.Input"
            }
        }

        const mainUserInput = await browser.asControl(inputSelector)
        await mainUserInput.enterText(newUsername)

        const newValue = await mainUserInput.getProperty("value")
        expect(newValue).toEqual(newUsername)
    })

    it("select ui5 input- + button-control by named json model and interact", async () => {
        // select button by binding path + click it
        const buttonSelector = {
            wdio_ui5_key: "buttonSelector",
            selector: {
                interaction: "focus",
                bindingPath: {
                    modelName: "testModel",
                    propertyPath: "/buttonText"
                },
                viewName,
                controlType: "sap.m.Button"
            }
        }

        const ui5Button = await browser.asControl(buttonSelector)
        await ui5Button.firePress()

        // select input by binding path + type in new text
        const inputSelector = {
            wdio_ui5_key: "inputSelector",
            selector: {
                interaction: "focus",
                bindingPath: {
                    modelName: "testModel",
                    propertyPath: "/inputValue"
                },
                viewName: viewName,
                controlType: "sap.m.Input"
            }
        }

        const ui5Input = await browser.asControl(inputSelector)

        const inputText = "new Input Value §§§"
        await ui5Input.enterText(inputText)

        expect(await ui5Input.getProperty("value")).toEqual(inputText)
    })
})
