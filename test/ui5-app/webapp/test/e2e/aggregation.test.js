const wdi5 = require('wdi5');
const Other = require('./pageObjects/Other');

describe('ui5 aggregation retrieval', () => {
    before(() => {
        Other.open();
    });

    beforeEach(() => {
        wdi5().getUtils().takeScreenshot('test-aggregation');
    });

    it('get aggregation and validate items', () => {
        // action:
        // get the aggreagation -> returns array of WDI5 controls
        const items = Other.getListItems();

        // assertions:
        // check all items are bound
        expect(items.length).toEqual(9);
        // loop though controls and validate entries (bound in the app view "Other")
        items.forEach((listItem) => {
            expect(Other.allNames.find((name) => listItem.getProperty('title') === name)).toBeTruthy();
        });
    });

    it('validate getProperty("title") and getTitle() are equivalent', () => {
        const items = Other.getListItems();
        items.forEach((listItem) => {
            expect(listItem.getProperty('title')).toEqual(listItem.getTitle());
        });
    });

    it('should successfully retrieve aggregation w/ and w/o "forceSelect" set', () => {
        const items = Other.getListItems();
        const itemsCached = Other.getListItems();
        const itemsRehydrated = Other.getListItems(true);
        expect(items.length).toBe(itemsCached.length);
        expect(items.length).toBe(itemsRehydrated.length);

        // expectation is that all wdi5 elements from cache
        // equal those of the original selected ones
        // but not the ones with the "forceSelect: true" option set
        items.forEach((item, i) => {
            expect(item).toEqual(itemsCached[i]);
            expect(item).not.toEqual(itemsRehydrated[i]);
        });
    });

    it('add LineItem and verify via "forceSelect" it exists in list', () => {
        // get items and save length before adding new item
        const itemsOld = Other.getListItems();

        // button which executes a function to add an additional line item
        const addLineItemButton = Other.getAddLineItemButtom();
        addLineItemButton.firePress();

        // after the added line item retrieve the list again
        const itemsOldRehydrated = Other.getListItems();

        // expect the list to be up-to-date
        expect(itemsOld.length + 1).toEqual(itemsOldRehydrated.length);

        // also retrieve list with forceSelect option
        const itemsRehydrated = Other.getListItems(true);

        // extract the last item of list
        const lastItemOfOldReference = itemsOldRehydrated[itemsOldRehydrated.length - 1];
        const lastItemOfRehydratedList = itemsRehydrated[itemsRehydrated.length - 1];

        // verify "forceSelect"
        expect(lastItemOfOldReference).not.toEqual(lastItemOfRehydratedList);
    });
});
