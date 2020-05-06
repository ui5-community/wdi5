const assert = require('assert');
const wdi5 = require('../../../../../index');

describe('ui5 showcase app - basic', () => {
    it('navigate to Other view', () => {
        // navigate to the "Other" view by button press where the list is
        const bs2 = {
            wdio_ui5_key: 'NavFwdButton',
            selector: {
                id: 'NavFwdButton',
                viewName: 'test.Sample.view.Main'
            }
        };

        const ui5Button = browser.asControl(bs2);
        ui5Button.press();
    });

    it('should get the aggregation of list', () => {
        // cerate selector
        const listSelector = {
            wdio_ui5_key: 'PeopleList', // plugin-internal, not part of RecordReplay.ControlSelector
            selector: {
                id: 'PeopleList',
                viewName: 'test.Sample.view.Other'
            }
        };
        // get the list
        const ui5List = browser.asControl(listSelector);
        // get the aggreagation -> returns array of WDI5 controls
        const items = ui5List.getAggregation('items');

        // loop though controls an log the title (bound in the app view "Other")
        items.forEach((i) => {
            wdi5().getLogger().log(i.getProperty('title'));
        });

        // check all items are loaded
        assert.ok(items.length === 9);
        // double check with the name of the first item
        assert.equal(items[0].getProperty('title'), 'Nancy Davolio');
    });
});
