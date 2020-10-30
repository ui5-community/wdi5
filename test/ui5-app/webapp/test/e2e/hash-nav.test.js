const wdi5 = require('wdi5');

describe('hash-based nav', () => {
    it('should allow the deep entry to "Other" view using the Utils and the UI5 router', () => {

        const oRouteOptions = {
            sComponentId: 'container-Sample',
            sName: "RouteOther"
        }
        wdi5().getUtils().goTo('', oRouteOptions);

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
    });

    it('should allow the deep entry to "Other" view via the UI5 router directly', () => {

        const oRouteOptions = {
            sComponentId: 'container-Sample',
            sName: "RouteOther"
        }
        browser.goTo({ oRoute: oRouteOptions });

        const listSelector = {
            selector: {
                id: 'PeopleList',
                viewName: 'test.Sample.view.Other'
            }
        };

        const list = browser.asControl(listSelector)
        expect(list.getVisible()).toBeTruthy();
    });
});
