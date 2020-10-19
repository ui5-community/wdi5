const wdi5 = require('wdi5');
const Main = require('./pageObjects/Main');

describe('ui5 checkbox test', () => {

    before(() => {
        Main.open();
    })

    it('should check the checkbox', () => {
        Main.getCheckbox().setSelected(true);

        expect(Main.getCheckbox().getProperty('selected')).toBeTruthy;
    });
    it('should uncheck the checkbox', () => {
        Main.getCheckbox().setSelected(false);

        expect(Main.getCheckbox().getProperty('selected')).toBeFalsy();
    });

    it('should uncheck the checkbox via wdio-native .click()', () => {

        const ui5checkBox2 = Main.getCheckbox();

        // working with web element can make it more easy than UI5 directly
        const webCheckBox2 = ui5checkBox2.getWebElement();
        webCheckBox2.click();

        wdi5()
            .getLogger()
            .log("ui5checkBox2.getProperty('selected') returned: " + ui5checkBox2.getProperty('selected'));

        // expect false and assert true
        expect(ui5checkBox2.getProperty('selected')).toBeTruthy();
    });
});
