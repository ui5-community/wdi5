
const ui5Service = require('../src/index')

describe('ui5 basic', () => {

    it('should show a non UI5 page, take a screenshot and open a UI5 page', () => {
        // using native wdio functionality
        browser.$('#user-content-wdi5-').waitForDisplayed()
        // verify ists not a ui5 page
        browser.takeScreenshot('test-github');

        // open ui5 page
        browser.url("https://openui5.netweaver.ondemand.com/index.html");
        // do the late injection
        ui5Service.injectUI5()
    });

    const selectorCookieAccept = {
        selector: {
            id: "__button4",
            controlType: 'sap.m.Button'
        }
    }

    beforeEach(() => {
        browser.screenshot('test-ui5');
    });

    // run some basic ui5 tests to verify all went well with the late init
    it('should accept the cookies', () => {
        const buttonCookieAccept = browser.asControl(selectorCookieAccept);
        buttonCookieAccept.firePress();
    });

    it('should have the right title', () => {
        const title = browser.getTitle();
        expect(title).toEqual('Home - Demo Kit - SAPUI5 SDK');
    });
});
