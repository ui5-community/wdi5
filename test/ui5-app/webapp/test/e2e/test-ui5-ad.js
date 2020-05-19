const assert = require('assert');
const wdi5 = require('../../../../../index');

describe('wdio-ui5 bridge: advanced tests', () => {
    globalThis.viewName = 'test.Sample.view.Main';

    it('go to otherview with by hash navigation', () => {
        // as example to make sure if no other wdi5 functions are used that the SAPUI5 application is fully up and running
        wdi5().getWDioUi5().waitForUI5();

        wdi5().getUtils().goTo('#/other');

        // check for the new page
        const listSelector = {
            wdio_ui5_key: 'PeopleList',
            selector: {
                id: 'PeopleList',
                viewName: 'test.Sample.view.Other'
            }
        };
        assert.equal(browser.asControl(listSelector).getProperty('headerText'), '...bites the dust!');
    });

    it('go back to mainview with by hash navigation', () => {
        wdi5().getUtils().goTo('#/main');
        // expect to be on main page -> otherwise the next test fails ...

        const cbSelector1 = {
            wdio_ui5_key: 'cbSelector1',
            selector: {
                id: 'idCheckbox',
                viewName: 'test.Sample.view.Main',
                controlType: 'sap.m.CheckBox'
            }
        };

        // initially checkbox is not selected
        assert.ok(!browser.asControl(cbSelector1).getProperty('selected'));
    });

    it('check the binding of the username input', () => {
        // set new Username
        const newUsername = 'my New Username';

        // create selector
        const inputSelector = {
            wdio_ui5_key: 'mainUserInput',
            selector: {
                // id: "mainUserInput",
                bindingPath: {
                    propertyPath: "/Customers('TRAIH')/ContactName"
                },
                // properties: {
                //     value: "Helvetius Nagy"
                // },
                viewName: globalThis.viewName,
                controlType: 'sap.m.Input'
            }
        };
        const mainUserInput = browser.asControl(inputSelector);

        // set text
        mainUserInput.enterText(newUsername);

        // #1 assert
        // get ui5 control
        const ui5Input = browser.asControl(inputSelector);
        // test for working binding
        assert.strictEqual(ui5Input.getProperty('value'), newUsername);
    });

    it('should test the named json model', () => {
        // #1 button test
        const buttonSelector = {
            wdio_ui5_key: 'buttonSelector',
            selector: wdi5()
                .getSelectorHelper()
                .cerateBindingPathSelector(globalThis.viewName, 'sap.m.Button', 'testModel', '/buttonText')
        };

        const ui5Button = browser.asControl(buttonSelector);
        ui5Button.press();

        // #2 input test
        const inputSelector = {
            wdio_ui5_key: 'inputSelector',
            selector: {
                bindingPath: {
                    modelName: 'testModel',
                    propertyPath: '/inputValue'
                },
                viewName: globalThis.viewName,
                controlType: 'sap.m.Input'
            }
        };
        const ui5Input = browser.asControl(inputSelector);

        const inputText = 'new Input Value §§§';
        ui5Input.enterText(inputText);

        assert.strictEqual(ui5Input.getProperty('value'), inputText);
    });
});
