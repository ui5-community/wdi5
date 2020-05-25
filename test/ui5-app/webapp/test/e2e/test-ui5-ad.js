const assert = require('assert');
const wdi5 = require('../../../../../index');

describe('wdio-ui5 bridge: advanced tests', () => {
    globalThis.viewName = 'test.Sample.view.Main';

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
