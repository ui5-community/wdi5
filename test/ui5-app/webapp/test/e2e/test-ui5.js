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

    it.skip('navigation button w/ text exists', () => {
        assert.strictEqual(browser.asControl(buttonSelector).getProperty('text'), 'to Other view');
    });

    it.skip('getProperty("text") and getText() are equivalent', () => {
        assert.strictEqual(
            browser.asControl(buttonSelector).getProperty('text'),
            browser.asControl(buttonSelector).getText()
        );
    });

    it.skip('sets the property of a control successfully', () => {
        const oButton = browser.asControl(buttonSelector);
        oButton.setProperty('text', 'new button text');

        assert.strictEqual(oButton.getText(), 'new button text');
    });

    it('should navigate via button click to list page', () => {
        const button = browser.asControl(buttonSelector)

        // this is the important quick test for the generated method bridge
        button.setEnabled(false);
        // this press should not work -> but works because it is fired by CODE -> code rules ;)
        button.press();

        assert.equal(browser.asControl(listSelector).getProperty('headerText'), '...bites the dust!');
    });

    it('control id retrieval methods are equivalent', () => {
        list = browser.asControl(listSelector);

        assert.ok(list.getId().includes('PeopleList'));
        assert.equal(list.getProperty('id'), list.getId());
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
