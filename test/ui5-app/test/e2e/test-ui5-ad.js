const assert = require("assert")
const wdi5 = require("../../../../index")

describe("ui5 showcase app", () => {
    it("should have the right button text", () => {

        // TODO: not sure if this is neede or is helpful
        // wdi5().getWDioUi5().waitForUI5();

        // make DOM
        // TODO: https://wiki.selfhtml.org/wiki/JavaScript/DOM/Node
        // both not working for any reason ...
        // const buttonAsDom = $("//body/div[2]/div/div/div/div/div[3]/div/div/div[2]/div/section/div/div[3]/button");
        // const buttonAsDom = $('container-Sample---Main--NavFwdButton');
        const buttonAsDom = $('bdi=IA Sync').$('..').$('..')

        // get selector as HTML as the class sap.ui.test.RecordReplay want to receive an Element
        // TODO: due to the need of wdio_ui5_key
        const buttonSelector = {
            wdio_ui5_key: "btmIASync",
            selector: browser.getSelectorForElement({ domElement: buttonAsDom, settings: { preferViewId: true } })
        }

        // compare text in DOM
        console.log("buttonSelector: " + JSON.stringify(buttonSelector));
        const ui5Button = browser.asControl(buttonSelector);

        assert.strictEqual(ui5Button.getProperty("text"), "IA Sync");
    })

    it("check the binding of the username input", () => {
        // set new Username
        const newUsername = "my New Username";

        // TODO:https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.ODataModel

        // create selector
        const inputSelector = {
            wdio_ui5_key: "mainUserInput",
            selector: {
                // TODO: both not working
                // id: "mainUserInput",
                // bindingPath: {
                //     propertyPath: "/Customers('TRAIH')/ContactName"
                // },
                properties: {
                    value: "Helvetius Nagy"
                },
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
        assert.strictEqual(ui5Input.getProperty("value"), newUsername)
    })
})
