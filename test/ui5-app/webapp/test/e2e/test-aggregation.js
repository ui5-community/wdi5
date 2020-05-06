const assert = require('assert');
const wdi5 = require('../../../../index');

describe('aggregation retrieval', () => {
    const allNames = [
        'Nancy Davolio',
        'Andrew Fuller',
        'Janet Leverling',
        'Margaret Peacock',
        'Steven Buchanan',
        'Michael Suyama',
        'Robert King',
        'Laura Callahan',
        'Anne Dodsworth'
    ];

    const listSelector = {
        wdio_ui5_key: 'PeopleList',
        selector: {
            id: 'PeopleList',
            viewName: 'test.Sample.view.Other'
        }
    };

    beforeEach(() => {
        wdi5().getUtils().takeScreenshot('test-aggregation');
    });

    it('get aggregation and validate items', () => {
        // arrangement:
        // navigate to the "Other" view, containing the list,
        // by pressing the nav button
        const buttonSelector = {
            wdio_ui5_key: 'NavFwdButton',
            selector: {
                id: 'NavFwdButton',
                viewName: 'test.Sample.view.Main'
            }
        };

        browser.asControl(buttonSelector).press();

        // action:
        // get the aggreagation -> returns array of WDI5 controls
        const items = browser.asControl(listSelector).getAggregation('items');

        // assertions:
        // check all items are bound
        assert.ok(items.length === 9);
        // loop though controls and validate entries (bound in the app view "Other")
        items.forEach((listItem) => {
            assert.ok(allNames.find((name) => listItem.getProperty('title') === name));
        });
    });

    it('validate getProperty("title") and getTitle() are equivalent', () => {
        const items = browser.asControl(listSelector).getAggregation('items');
        items.forEach((listItem) => {
            assert.strictEqual(listItem.getProperty('title'), listItem.getTitle());
        });
    });
});
