const wdi5 = require('../../../../../index');

describe('hash-based nav', () => {
    it('should allow the deep entry to "Other" view via #/Other', () => {
        wdi5().getUtils().goTo('#/Other');

        const listSelector = {
            selector: {
                id: 'PeopleList',
                viewName: 'test.Sample.view.Other'
            }
        };

        const items = browser.asControl(listSelector).getAggregation('items');
        expect(items.length).toEqual(9);
    });

    it('should navigate to Main view via #/', () => {
        wdi5().getUtils().goTo('#/');

        const buttonSelector = {
            selector: {
                id: 'NavFwdButton',
                viewName: 'test.Sample.view.Main'
            }
        };

        expect(browser.asControl(buttonSelector).getProperty("visible")).toBeTruthy()
    })
});
