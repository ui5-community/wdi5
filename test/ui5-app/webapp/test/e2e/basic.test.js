const wdi5 = require('wdi5');
const Main = require('./pageObjects/Main');

describe('ui5 basic', () => {
    globalThis.viewName = 'test.Sample.view.Main';

    before(() => {
        Main.open();
    });

    beforeEach(() => {
        wdi5().getLogger().log('beforeEach');
        wdi5().getUtils().screenshot('test-basic');
    });

    // TODO: make this work -> see #106
    it.skip('should find a control with visible: false', () => {
        const id = 'invisibleInputField';

        // wdio-native selector
        const wdioInput = browser.$(`[id$="${id}"]`);
        expect(wdioInput.getProperty('id')).toContain('sap-ui-invisible');

        const selector = {
            selector: {
                id,
                controlType: 'sap.m.Input',
                viewName: globalThis.viewName,
                visible: false
            }
        };
        const input = browser.asControl(selector);
        expect(input.getVisible()).toBe(false);

        input.setVisible(true);
        expect(input.getVisible()).toBe(true);
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

    it('should find a ui5 control class via .hasStyleClass', () => {
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

        if (parseFloat(browser.getUI5Version()) <= 1.6) {
            selector.forceSelect = true;
            selector.selector.interaction = 'root';
        }

        const control = browser.asControl(selector);
        const retrievedClassNameStatus = control.hasStyleClass(className);

        wdi5().getLogger().log('retrievedClassNameStatus', retrievedClassNameStatus);
        expect(retrievedClassNameStatus).toBeTruthy();
    });
});
