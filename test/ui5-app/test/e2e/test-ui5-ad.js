const assert = require("assert")
const wdi5 = require("../../../../index")

describe("ui5 showcase app - ui5 advanced", () => {

    globalThis.viewName = "test.Sample.view.Main"

    it("should have the right button text", () => {

        // as example to make sure if no other wdi5 functions are used that the SAPUI5 application is fully up and running
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
        const buttonSelector = {
            wdio_ui5_key: "btmIASync",
            selector: browser.getSelectorForElement({ domElement: buttonAsDom, settings: { preferViewId: true } })
            // alternative -> create selector yourself
            /* selector: {
                properties: {
                    text: "IA Sync"
                },
                viewName: globalThis.viewName,
                controlType: "sap.m.Button"
            } */
        }

        // compare text in DOM
        const ui5Button = browser.asControl(buttonSelector);
        assert.strictEqual(ui5Button.getProperty("text"), expButtonText);
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
                viewName: globalThis.viewName,
                controlType: "sap.m.Input"
            }
        }
        const mainUserInput = browser.asControl(inputSelector);

        // set text
        mainUserInput.enterText(newUsername)

        // #1 assert
        // get ui5 control
        const ui5Input = browser.asControl(inputSelector)
        // test for working binding
        assert.strictEqual(ui5Input.getProperty("value"), newUsername)
    })

    it("should test the named json model", () => {
        // #1 button test
        const buttonSelector = {
            wdio_ui5_key: "buttonSelector",
            selector: wdi5().getSelectorHelper().cerateBindingPathSelector(globalThis.viewName, "sap.m.Button", "testModel", "/buttonText")
        }

        const ui5Button = browser.asControl(buttonSelector)
        ui5Button.press()

        // #2 input test
        const inputSelector = {
            wdio_ui5_key: "inputSelector",
            selector: {
                bindingPath: {
                    modelName: "testModel",
                    propertyPath: "/inputValue"
                },
                viewName: globalThis.viewName,
                controlType: "sap.m.Input"
            }
        }
        const ui5Input = browser.asControl(inputSelector)

        const inputText = "new Input Value §§§"
        ui5Input.enterText(inputText)

        assert.strictEqual(ui5Input.getProperty("value"), inputText)
    })
})
