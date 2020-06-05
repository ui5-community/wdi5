const assert = require('assert');
const wdi5 = require('../../../../../index');

describe('hash-based nav', () => {
    it('should allow the deep entry to "Other" view via #/Other', () => {
        // wdi5().getUtils().takeScreenshot('hash-based nav 1.1');
        wdi5().getUtils().goTo('#/Other');
        // wdi5().getWDioUi5().waitForUI5();

        const listSelector = {
            wdio_ui5_key: 'PeopleList',
            selector: {
                id: 'PeopleList',
                viewName: 'test.Sample.view.Other'
            }
        };

        const items = browser.asControl(listSelector).getAggregation('items');
        assert.ok(items.length === 9);
        // wdi5().getUtils().takeScreenshot('hash-based nav 1.2');
    });

    it('should navigate to Main view via #/', () => {
        // wdi5().getUtils().takeScreenshot('hash-based nav 2.1');
        wdi5().getUtils().goTo('#/');
        // wdi5().getWDioUi5().waitForUI5();

        const buttonSelector = {
            wdio_ui5_key: 'NavFwdButton',
            selector: {
                id: 'NavFwdButton',
                viewName: 'test.Sample.view.Main'
            }
        };

        assert.ok(browser.asControl(buttonSelector).isVisible())
        // wdi5().getUtils().takeScreenshot('hash-based nav 2.2');
    })
});
