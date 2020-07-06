const wdi5 = require('../../../../../index'); // require('wdi5')

describe('ui5con example - screenshot, plugin mock, interaction, control aggregation', () => {

    beforeEach(() => {
        wdi5().getUtils().takeScreenshot('test-ui5con-example');
    });

    it('should showcase the fingerprint', () => {
        // the tested plugin is only available for android and ios -> test if current test execution runs on a native device
        const deviceType = wdi5().getUtils().getConfig("deviceType");
        if (deviceType === "native") {

            // 1. press the button identified with BOO
            const buttonSelector = {
                selector: {
                    id: 'onBoo',
                    viewName: 'test.Sample.view.Main',
                    controlType: 'sap.m.Button'
                }
            }
            // 2. retrieve the button
            const booButton = browser.asControl(buttonSelector); // `browser` is wdio-native, `asControl` is wdi5 (~UIveri5)
            booButton.press();

            // 3. check the text change
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

            const ui5AuthenticationMessage = browser.asControl(textSelector);
            // 4. expect the text to display an successfull authentication
            expect(ui5AuthenticationMessage.getText()).toStrictEqual('Authentication successful');
        }
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

        // 3. press the button via wdi5 press()
        fwdButton.press();
    });

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

    it('get aggregation and validate items', () => {
        // expect to be on the Other view
        const listSelector = {
            selector: {
                id: 'PeopleList',
                viewName: 'test.Sample.view.Other'
            }
        };

        // action:
        // get the aggregation -> returns array of WDI5 controls
        const items = browser.asControl(listSelector).getAggregation('items');

        // assertions:
        // check all items are bound
        expect(items.length).toStrictEqual(9);

        // loop though controls and validate entries
        items.forEach((item, i) => {
            expect(allNames[i]).toStrictEqual(item.getProperty('title'));
        })

        // // Bonus -> One more thing
        // // check the list length again after newly retrieving the list
        // // showcase internal control re-use! (no additional roundtrips)
        // const items2 = browser.asControl(listSelector).getAggregation('items');
        // expect(items2.length === items.length).toBeTruthy()
    });

});
