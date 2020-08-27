const wdi5 = require('../../../../../index');
const Main = require("./pageObjects/Main")
const Other = require("./pageObjects/Other")

describe('ui5 basic', () => {
    globalThis.viewName = 'test.Sample.view.Main';

    before(() => {
        Main.open();
    })

    beforeEach(() => {
        wdi5().getLogger().log('beforeEach');
        wdi5().getUtils().takeScreenshot('test-basic');
    });

    /*
     * It is important that we run each test in isolation. The running of a previous test
     * should not affect the next one. Otherwise, it could end up being very difficult to
     * track down what is causing a test to fail.
     */
    it('should have the right title', () => {
        const title = browser.getTitle();
        expect(title).toEqual('Sample UI5 Application');
    });

    it('should navigate via button click to #Other view and back', () => {
        const buttonSelector = {
            selector: {
                id: 'NavFwdButton',
                viewName: 'test.Sample.view.Main',
                controlType: "sap.m.Button",
            }
        };

        browser.asControl(buttonSelector).fireEvent("press");

        // on other view
        const backButtonSelector = {
            selector: {
                // Todo: create selector
                viewName: 'test.Sample.view.Other',
                controlType: "sap.m.Button",
            }
        }

        const listSelector = {
            selector: {
                id: "PeopleList",
                viewName: 'test.Sample.view.Other'
            }
        }

        const listTitle = browser.asControl(listSelector).getHeaderText()

        expect(listTitle).toEqual("...bites the dust!")
    });

    it.skip('changes page back to Main', () => {
        Main.open()
    })

    it.skip('should find a ui5 control class via .hasStyleClass', () => {
        // webdriver
        const className = 'myTestClass';

        // ui5
        const selector = {
            wdio_ui5_key: 'buttonSelector',
            selector: {
                bindingPath: {
                    modelName: 'testModel',
                    propertyPath: '/buttonText'
                },
                viewName: globalThis.viewName,
                controlType: 'sap.m.Button'
            }
        };

        const control = browser.asControl(selector);
        const retrievedClassNameStatus = control.hasStyleClass(className);

        wdi5().getLogger().log('retrievedClassNameStatus', retrievedClassNameStatus);
        expect(retrievedClassNameStatus).toBeTruthy();
    });
});
