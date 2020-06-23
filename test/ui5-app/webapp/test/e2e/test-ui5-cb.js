const assert = require('assert');
const wdi5 = require('../../../../../index');
const Main = require('./pageObjects/Main');

describe('ui5 checkbox test', () => {

    it('should check the checkbox', () => {
        Main.getCheckbox().check();

        assert.ok(Main.getCheckbox().getProperty('selected'));
    });
    it('should uncheck the checkbox', () => {
        Main.getCheckbox().uncheck();

        assert.ok(!Main.getCheckbox().getProperty('selected'));
    });
    it('should toggle the checkbox', () => {
        Main.getCheckbox().toggle();

        assert.ok(Main.getCheckbox().getProperty('selected'));
    });

    it('should uncheck the checkbox via wdio-native .click()', () => {

        const ui5checkBox2 = Main.getCheckbox();

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
