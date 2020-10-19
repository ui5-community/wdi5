const wdi5 = require('wdi5');
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
        expect(items.length).toEqual(9);
        // loop though controls and validate entries (bound in the app view "Other")
        items.forEach((listItem) => {
            expect(Other.allNames.find((name) => listItem.getProperty('title') === name)).toBeTruthy();
        });
    });

    it('validate getProperty("title") and getTitle() are equivalent', () => {
        const items = Other.getListItmes();
        items.forEach((listItem) => {
            expect(listItem.getProperty('title')).toEqual(listItem.getTitle());
        });
    });
});
