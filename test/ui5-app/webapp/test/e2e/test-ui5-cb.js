const assert = require('assert');
const wdi5 = require('../../../../../index');

describe('ui5 checkbox test', () => {
    const cbSelector1 = {
        selector: {
            id: 'idCheckbox',
            viewName: 'test.Sample.view.Main',
            controlType: 'sap.m.CheckBox'
        }
    };

    it('should check the checkbox', () => {
        browser.asControl(cbSelector1).check();

        assert.ok(browser.asControl(cbSelector1).getProperty('selected'));
    });
    it('should uncheck the checkbox', () => {
        browser.asControl(cbSelector1).uncheck();

        assert.ok(!browser.asControl(cbSelector1).getProperty('selected'));
    });
    it('should toggle the checkbox', () => {
        browser.asControl(cbSelector1).toggle();

        assert.ok(browser.asControl(cbSelector1).getProperty('selected'));
    });

    it('should uncheck the checkbox via wdio-native .click()', () => {

        const ui5checkBox2 = browser.asControl(cbSelector1);

        // working with web element can make it more easy than UI5 directly
        const webCheckBox2 = ui5checkBox2.getWebElement();
        $(webCheckBox2).click();

        wdi5()
            .getLogger()
            .log("ui5checkBox2.getProperty('selected') returned: " + ui5checkBox2.getProperty('selected'));
        // expect false and assert true
        assert.ok(!ui5checkBox2.getProperty('selected'));
    });
});
