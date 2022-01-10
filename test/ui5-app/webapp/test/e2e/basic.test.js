const wdi5 = require('wdi5');
const Main = require('./pageObjects/Main');

describe('ui5 basic', () => {
    globalThis.viewName = 'test.Sample.view.Main';

    before(async () => {
        await Main.open();
    });

    beforeEach(async () => {
        const _wdi5 = await wdi5();
        _wdi5.getLogger().log('beforeEach');
        _wdi5.getUtils().screenshot('test-basic');
    });

    it('should have the right title', async () => {
        const title = await browser.getTitle();
        expect(title).toEqual('Sample UI5 Application');
    });

    it('should find a ui5 control class via .hasStyleClass', async () => {
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

        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            selector.forceSelect = true;
            selector.selector.interaction = 'root';
        }

        const control = await browser.asControl(selector);
        const retrievedClassNameStatus = await control.hasStyleClass(className);

        (await wdi5()).getLogger().log('retrievedClassNameStatus', retrievedClassNameStatus);
        expect(retrievedClassNameStatus).toBeTruthy();
    });
});
