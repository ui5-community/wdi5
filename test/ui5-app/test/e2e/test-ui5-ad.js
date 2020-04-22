const assert = require("assert")
const wdi5 = require("../../../../index")

describe("ui5 showcase app - ui5 advanced", () => {
    it.only("should have the right button text", () => {

        // TODO: not sure if this is neede or is helpful
        wdi5().getWDioUi5().waitForUI5();

        // make DOM
        // TODO: this needs to go like this if we do get the button direktly it wont work
        const buttonAsDom = $('/html/body/div[2]/div/div/div/div/div[3]/div/div/div[2]/div/section/div/div[3]/button/span/span/bdi').$('../..');
        // const buttonAsDom = $('/html/body/div[2]/div/div/div/div/div[3]/div/div/div[2]/div/section/div/div[2]/button/span/span[2]/bdi').$('..').$('..'); // to Other view
        const expButtonText = "IA Sync"; // IA Sync // to Other view

        if (buttonAsDom.error) {
            // button was not found by wdio
            const error = "buttonAsDom.error: " + JSON.stringify(buttonAsDom.error);
            wdi5().getLogger().error(error);
            throw new Error("buttonAsDom.error: " + error);
        }
        // get selector as HTML as the class sap.ui.test.RecordReplay want to receive an Element
        // TODO: due to the need of wdio_ui5_key
        const buttonSelector = {
            wdio_ui5_key: "btmIASync",
            selector: browser.getSelectorForElement({ domElement: buttonAsDom, settings: { preferViewId: true } })
            // alternative -> create selector yourself
            /* selector: {
                properties: {
                    text: "IA Sync"
                },
                viewName: "test.Sample.view.Main",
                controlType: "sap.m.Button"
            } */
        }

        // compare text in DOM
        const ui5Button = browser.asControl(buttonSelector);
        assert.strictEqual(ui5Button.getProperty("text"), expButtonText);

        // #2 webdriver way
        const wdio5Button = browser.getControl(buttonSelector)
        assert.strictEqual($(wdio5Button).$('<bdi />').getText(), expButtonText);
    })

    it("check the binding of the username input", () => {
        // set new Username
        const newUsername = "my New Username";

        // create selector
        const inputSelector = {
            wdio_ui5_key: "mainUserInput",
            selector: {
                // id: "mainUserInput",
                bindingPath: {
                    propertyPath: "/Customers('TRAIH')/ContactName"
                },
                // properties: {
                //     value: "Helvetius Nagy"
                // },
                viewName: "test.Sample.view.Main",
                controlType: "sap.m.Input"
            }
        }

        // set text
        browser.interactWithControl({ selector: inputSelector.selector, clearTextFirst: true, interactionType: "ENTER_TEXT", enterText: newUsername })

        // #1 assert
        // get ui5 control
        const ui5Input = browser.asControl(inputSelector)
        // test for working binding
        assert.strictEqual(ui5Input.getProperty("value"), newUsername)

        // #2 assert
        const testForUI5Control = browser.getControl(inputSelector)
        assert.strictEqual($(testForUI5Control).getValue(), newUsername)
    })

    it("should test the named json model", () => {
        // #1 button test
        const buttonSelector = {
            wdio_ui5_key: "buttonSelector",
            selector: {
                bindingPath: {
                    modelName: "testModel",
                    propertyPath: "/buttonText"
                },
                viewName: "test.Sample.view.Main",
                controlType: "sap.m.Button"
            }
        }

        const ui5Button = browser.getControl(buttonSelector)
        $(ui5Button).click()

        // #2 input test

        const inputSelector = {
            wdio_ui5_key: "inputSelector",
            selector: {
                bindingPath: {
                    modelName: "testModel",
                    propertyPath: "/inputValue"
                },
                viewName: "test.Sample.view.Main",
                controlType: "sap.m.Input"
            }
        }

        const inputText = "new Input Value §§§"
        browser.interactWithControl({
            selector: inputSelector.selector,
            clearTextFirst: true,
            interactionType: "ENTER_TEXT",
            enterText: inputText
        })

        const ui5Input = browser.asControl(inputSelector)
        assert.strictEqual(ui5Input.getProperty("value"), inputText)
    })
})
