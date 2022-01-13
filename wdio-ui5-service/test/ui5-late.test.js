// only requiring the service for late inject/init
const _ui5Service = require('wdio-ui5-service').default;
const ui5Service = new _ui5Service();

describe('ui5 basic', () => {
    it('should show a non UI5 page, take a screenshot, advance to a UI5 page and late init "ui5"', async () => {
        // native wdio functionality
        await browser.$('#user-content-wdi5-').waitForDisplayed();
        await browser.takeScreenshot();

        // open ui5 page
        await browser.url('https://openui5.netweaver.ondemand.com/index.html');
        // do the late injection
        await ui5Service.injectUI5();
    });

    const selectorCookieAccept = {
        selector: {
            bindingPath: {
                modelName: 'cookieData',
                propertyPath: '/showCookieDetails'
            },
            controlType: 'sap.m.Button'
        }
    };

    it('"ui5": ui5 sdk page should have the right title', async () => {
        if (parseFloat(await browser.getUI5Version()) <= 1.6) {
            selectorCookieAccept.forceSelect = true;
            selectorCookieAccept.selector.interaction = 'root';
        }
        // use wdi5 aka "ui5" wdio service to verify all went well with the late init
        await browser.screenshot('test-ui5');

        const buttonCookieAccept = await browser.asControl(selectorCookieAccept);
        await buttonCookieAccept.firePress();

        const title = await browser.getTitle();
        await expect(title).toMatch('Demo Kit - OPENUI5 SDK');
    });
});
