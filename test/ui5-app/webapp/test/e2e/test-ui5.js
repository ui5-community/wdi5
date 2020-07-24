const assert = require('assert');
const wdi5 = require('../../../../../index');

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

    beforeEach(() => {
        wdi5().getUtils().takeScreenshot('test-ui5');
    });

    afterEach(() => {
        wdi5().getUtils().takeScreenshot('test-ui5');
    });

    it('should navigate via button click to list page', () => {
        const button = browser.asControl(buttonSelector)
        button.press();
        assert.equal(browser.asControl(listSelector).getProperty('headerText'), '...bites the dust!');
    });

    it('press an list item an show the name', () => {

        const listItemSelector = {
            selector: {
                controlType: "sap.m.StandardListItem",
                viewName: "test.Sample.view.Other"
            }
        }

        const listitem = browser.asControl(listItemSelector)

        // TODO:
        // browser.asControl(listSelector).asControl ....

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

        assert.equal(browser.asControl(resultTetSelector).getText(), "Mock Name");
    })
});
