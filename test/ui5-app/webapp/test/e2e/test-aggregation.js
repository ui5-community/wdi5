const assert = require('assert');
const wdi5 = require('../../../../../index');
const Other = require("./pageObjects/Other")

describe('ui5 aggregation retrieval', () => {


    before(() => {
        Other.open();
    })

    beforeEach(() => {
        wdi5().getUtils().takeScreenshot('test-aggregation');
    });

    it('get aggregation and validate items', () => {

        // action:
        // get the aggreagation -> returns array of WDI5 controls
        const items = Other.getListItmes()

        // assertions:
        // check all items are bound
        assert.ok(items.length === 9);
        // loop though controls and validate entries (bound in the app view "Other")
        items.forEach((listItem) => {
            assert.ok(Other.allNames.find((name) => listItem.getProperty('title') === name));
        });
    });

    it('validate getProperty("title") and getTitle() are equivalent', () => {
        const items = Other.getListItmes();
        items.forEach((listItem) => {
            assert.strictEqual(listItem.getProperty('title'), listItem.getTitle());
        });
    });
});
