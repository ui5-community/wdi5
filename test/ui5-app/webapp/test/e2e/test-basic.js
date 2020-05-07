const assert = require('assert');
const wdi5 = require('../../../../../index');

describe('ui5 showcase app - basic', () => {
    globalThis.viewName = 'test.Sample.view.Main';

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
        assert.strictEqual(title, 'Sample UI5 Application');
    });

    /**
     * test for not using the wdio-ui5
     */
    it('should have the right version', () => {
        var sapV = driver.executeAsync((done) => {
            done(sap.ui.version);
        });

        wdi5().getLogger().log(sapV);

        assert.strictEqual(sapV, '1.77.2');
    });

    it('should have the class', () => {
        // webdriver
        const className = 'myTestClass';

        // ui5
        const selector = {
            wdio_ui5_key: 'buttonSelector',
            selector: wdi5()
                .getSelectorHelper()
                .cerateBindingPathSelector(globalThis.viewName, 'sap.m.Button', 'testModel', '/buttonText')
        };
        const control = browser.asControl(selector);
        const retrievedClassNameStatus = control.hasStyleClass(className);

        wdi5().getLogger().log('retrievedClassNameStatus', retrievedClassNameStatus);
        assert.ok(retrievedClassNameStatus);
    });
});
