const assert = require("assert")
const wdi5 = require("wdio-ui5")

describe("ui5 showcase app", () => {
    it("should have the right button text", () => {
        // make DOM
        const buttonAsDom = $("//body/div[2]/div/div/div/div/div[3]/div/div/div[2]/div/section/div/div[3]/button");

        // get selector as HTML as the class sap.ui.test.RecordReplay want to receive an Element
        // console.log("buttonAsDom: " + buttonAsDom.getHTML().getAttribute("data-sap-ui"));
        const buttonSelector = browser.getSelectorForElement({ domElement: buttonAsDom.getHTML(), settings: { preferViewId: true } })

        // compare text in DOM
        // TODO: due to the need of wdio_ui5_key
        buttonSelector.wdio_ui5_key = "btmIASync"

        // console.log("buttonSelector: " + JSON.stringify(buttonSelector));
        const ui5Button = browser.asControl(buttonSelector)

        assert.strictEqual(ui5Button.getProperty("text"), "IA Sync");
    })

    it("check the binding of the username input", () => {
        // set new Username
        const newUsername = "my New Username";

        // create selector
        const inputSelector = {
            wdio_ui5_key: "mainUserInput",
            selector: {
                bindingPath: "Backend>/Me/FirstName",
                viewName: "test.Sample.view.Main",
                controlType: "sap.m.Input"
            }
        }

        // set text
        browser.interactWithControl({ selector: inputSelector.selector, clearTextFirst: true, interactionType: "ENTER_TEXT", enterText: newUsername })

        // get ui5 control
        const ui5Input = browser.asControl(inputSelector)

        // test for wokring binding
        // console.log("ui5Input: " + JSON.stringify(ui5Input))
        assert.strictEqual(ui5Input.getProperty("value") === newUsername)
    })
})
