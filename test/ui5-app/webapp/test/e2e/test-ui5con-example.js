const wdi5 = require('../../../../../index');

describe('test-ui5con-example', () => {

    // expected names in the list
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

    beforeEach(() => {
        wdi5().getUtils().takeScreenshot('test-ui5con-example');
    });

    it.only('should showcase the fingerprint', () => {
        const buttonSelector = {
            selector: {
                id: "onBoo",
                viewName: 'test.Sample.view.Main',
                controlType: 'sap.m.Button'
            }
        }
        const fwdButton = browser.asControl(buttonSelector);
        fwdButton.press();

        const elem = $('//*[@id="sap-ui-static"]/div');
        expect(elem).toHaveAttr("class", "sapMMessageToast sapUiSelectable sapContrast sapContrastPlus")
        expect(elem).toBeVisible();

        const textSelector = {
            selector: {
                controlType: "sap.m.Text",
                viewName: "test.Sample.view.Main",
                bindingPath: {
                    modelName: 'testModel',
                    propertyPath: '/fingerprint'
                },
            }
        }

        const ui5Text = browser.asControl(textSelector);
        expect(ui5Text.getText() === 'Authentication successful').toBeTruthy();

    });

    it('should navigate to "Other" view by button press', () => {

        // Three step process
        // 1. create selector
        const buttonSelector = {
            selector: {
                properties: {
                    icon: "sap-icon://forward"
                },
                viewName: 'test.Sample.view.Main',
                controlType: 'sap.m.Button'
            }
        }

        // 2. retrieve the button from browser context
        const fwdButton = browser.asControl(buttonSelector);

        // this API provides wdi5
        // 3. press the button
        fwdButton.press();
    });

    it('get aggregation and validate items', () => {


        // expect to be on the Other view
        const listSelector = {
            selector: {
                id: 'PeopleList',
                viewName: 'test.Sample.view.Other'
            }
        };

        // action:
        // get the aggreagation -> returns array of WDI5 controls
        const items = browser.asControl(listSelector).getAggregation('items');

        // assertions:
        // check all items are bound
        expect(items.length === 9).toBeTruthy();

        // loop though controls and validate entries
        // loop assumes the same order !
        for (let i = 0; i < items.length - 1; i++) {
            expect(allNames[i] === items[i].getProperty('title')).toBeTruthy();
        }

        // check the list length again after newly retrieving the list
        // show the internal control mapping works
        const items2 = browser.asControl(listSelector).getAggregation('items');
        expect(items2.length === items.length).toBeTruthy()
    });

});
