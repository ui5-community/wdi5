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

    it("enterText() with pressEnterKey:true triggers search event", async () => {
        const searchFieldSelector = {
            selector: {
                id: "idSearchfield",
                viewName: viewName,
                interaction: "focus"
            }
        }
        const searchResultSelector = {
            selector: {
                id: "idSearchResult",
                viewName: viewName
            }
        }

        const searchTerm = "Alice"
        const searchField = await browser.asControl(searchFieldSelector)
        await searchField.enterText(searchTerm, { pressEnterKey: true })

        const searchResult = await browser.asControl(searchResultSelector)
        expect(await searchResult.getProperty("text")).toEqual(searchTerm)
    })

    it("enterText() with pressEnterKey:false does not trigger search event", async () => {
        const searchFieldSelector = {
            selector: {
                id: "idSearchfield",
                viewName: viewName
            }
        }
        const searchResultSelector = {
            selector: {
                id: "idSearchResult",
                viewName: viewName
            }
        }

        // capture the current search result before typing (set by the previous test)
        const searchResult = await browser.asControl(searchResultSelector)
        const previousResult = await searchResult.getProperty("text")

        const searchTerm = "Charlie"
        const searchField = await browser.asControl(searchFieldSelector)
        // pressEnterKey:false — text is entered but Enter is not pressed, so onSearch is not fired
        await searchField.enterText(searchTerm, { pressEnterKey: false, keepFocus: true })

        // result text must remain unchanged since the search event was not triggered
        expect(await searchResult.getProperty("text")).toEqual(previousResult)
    })

    it("enterText() with keepFocus:false blurs the input and triggers change event", async () => {
        const inputSelector = {
            selector: {
                id: "idKeepFocusInput",
                viewName: viewName,
                interaction: "focus"
            }
        }
        const resultSelector = {
            selector: {
                id: "idKeepFocusResult",
                viewName: viewName
            }
        }

        const inputText = "keep focus off"
        const input = await browser.asControl(inputSelector)
        // keepFocus:false (default) — focus is removed after enterText, which fires the change event
        await input.enterText(inputText, { keepFocus: false })

        const result = await browser.asControl(resultSelector)
        expect(await result.getProperty("text")).toEqual(inputText)
    })

    it("enterText() with keepFocus:true retains focus and does not trigger change event", async () => {
        const inputSelector = {
            selector: {
                id: "idKeepFocusInput",
                viewName: viewName,
                interaction: "focus"
            }
        }
        const resultSelector = {
            selector: {
                id: "idKeepFocusResult",
                viewName: viewName
            }
        }

        // capture current result (set by previous test)
        const result = await browser.asControl(resultSelector)
        const previousResult = await result.getProperty("text")

        const inputText = "keep focus on"
        const input = await browser.asControl(inputSelector)
        // keepFocus:true — focus is retained after enterText, so no blur occurs and change event does not fire
        await input.enterText(inputText, { keepFocus: true })

        // result text must remain unchanged since the change event was not triggered
        expect(await result.getProperty("text")).toEqual(previousResult)
    })

    it("enterText() with clearTextFirst:true replaces existing input value", async () => {
        const inputSelector = {
            selector: {
                id: "idClearTextInput",
                viewName: viewName,
                interaction: "focus"
            }
        }
        const resultSelector = {
            selector: {
                id: "idClearTextResult",
                viewName: viewName
            }
        }

        const appendedText = " World"
        const input = await browser.asControl(inputSelector)
        // clearTextFirst:true (default) — existing "Hello" is cleared before typing, so only appended text remains
        await input.enterText(appendedText, { clearTextFirst: true })

        const result = await browser.asControl(resultSelector)
        expect(await result.getProperty("text")).toEqual(appendedText)
    })

    it.skip("enterText() with clearTextFirst:false appends to existing input value", async () => {
        // TODO: perhaps capture UI5 event in a browser.execute command to ensure whether this has been triggered
        const inputSelector = {
            selector: {
                id: "idClearTextInput",
                viewName: viewName,
                interaction: "focus"
            }
        }
        const resultSelector = {
            selector: {
                id: "idClearTextResult",
                viewName: viewName
            }
        }

        const initialText = "Hello"
        const appendedText = " World"
        // restore a known value first (clearTextFirst:true so we start clean)
        const input = await browser.asControl(inputSelector)
        await input.enterText(initialText, { clearTextFirst: true })
        // clearTextFirst:false — existing "Hello" is kept and new text is appended after it
        await input.enterText(appendedText, { clearTextFirst: false })

        const result = await browser.asControl(resultSelector)
        expect(await result.getProperty("text")).toEqual(initialText + appendedText)
    })
})
