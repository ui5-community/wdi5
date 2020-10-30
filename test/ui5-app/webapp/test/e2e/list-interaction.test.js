const wdi5 = require('wdi5');
const Other = require("./pageObjects/Other")

describe('ui5 basics: properties and navigation', () => {
    const buttonSelector = {
        selector: {
            id: 'NavFwdButton',
            viewName: 'test.Sample.view.Main'
        }
    };

    const listSelector = {
        selector: {
            id: 'PeopleList',
            viewName: 'test.Sample.view.Other'
        }
    };

    before(() => {
        Other.open();
    })

    beforeEach(() => {
        wdi5().getUtils().takeScreenshot('test-ui5');
    });

    afterEach(() => {
        wdi5().getUtils().takeScreenshot('test-ui5');
    });

    it('should have the correct list header', () => {
        expect(browser.asControl(listSelector).getProperty('headerText')).toEqual('...bites the dust!');
    });

    it('press an list item an show the name', () => {

        // fire click event on a list item.
        // the event handler function checks the data:key property of the list item -> manually add this property to the event.
        browser.asControl(listSelector).fireEvent("itemPress", {
            eval: () => {
                return {
                    listItem: {
                        data: () => { return "Mock Name" }
                    }
                }
            }
        })

        const resultTetSelector = {
            selector: {
                id: "idTextFieldClickResult",
                viewName: "test.Sample.view.Other"
            }
        }

        expect(browser.asControl(resultTetSelector).getText()).toEqual("Mock Name");
    })
});
