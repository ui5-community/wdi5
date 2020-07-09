const wdi5 = require('../../../../../index'); // require('wdi5')

// describe the tests we do
describe('ui5con example - screenshot, plugin mock, interaction, control aggregation', () => {

    beforeEach(() => {
        // take screenshot with string: ui5con-before-test
        // #action
        wdi5().getUtils().takeScreenshot("ui5con-before-test")

    });

    afterEach(() => {
        wdi5().getUtils().takeScreenshot("ui5con-after-test")
    })

    it('should showcase the fingerprint', () => {
        // the tested plugin is only available for android and ios -> test if current test execution runs on a native device
        const deviceType = wdi5().getUtils().getConfig("deviceType");
        if (deviceType === "native") {

            // 1. press the button identified with id "onBoo"
            // #action
            const buttonSelector = {
                selector: {
                    id: 'onBoo',
                    viewName: 'test.Sample.view.Main',
                    controlType: 'sap.m.Button'
                }
            }

            // 2. retrieve the button
            // `browser` is wdio-native, `asControl` is wdi5 (~UIveri5)
            // #action
            const ui5Button = browser.asControl(buttonSelector)

            // 2.1 press the button
            // #action
            ui5Button.press()


            // 3. check the text change
            // 3.1 create text selector by binding path testModel > / fingerprint
            // #action
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

            // 4. get the control -> ui5AuthenticationMessage
            // #action
            const ui5AuthenticationMessage = browser.asControl(textSelector)

            // 5. expect the text to display an successfull authentication with string "Authentication successful"
            // getText method from the UI5 stack
            // #action
            expect(ui5AuthenticationMessage.getText()).toStrictEqual("Authentication successful")
        }
    });

    it('should navigate to "Other" view by button press', () => {
        // Three step process
        // 1. create property selector by icon "sap-icon://forward"
        const buttonSelector = {
            selector: {
                // #action
                properties: {
                    icon: "sap-icon://forward"
                },
                viewName: "test.Sample.view.Main",
                controlType: "sap.m.Button"
            }
        }

        // 2. retrieve the button from browser context
        const fwdButton = browser.asControl(buttonSelector);

        // 3. press the button via wdi5 press()
        fwdButton.press();
    });

    // assumption array, expected names in the list
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
        // #1. create selector
        const listSelector = {
            selector: {
                id: 'PeopleList',
                viewName: 'test.Sample.view.Other'
            }
        };

        // #2. get the aggregation items -> returns array of WDI5 controls
        // #action
        const items = browser.asControl(listSelector).getAggregation('items')

        // #3. check all items are bound check the length
        expect(items.length).toStrictEqual(allNames.length);

        // #4. test each of the names matches the the static assumption array
        // loop though retrieved controls and validate entries
        items.forEach((item, i) => {
            // sequential run since the order does not change
            expect(allNames[i]).toStrictEqual(item.getProperty('title'));
        })

        // // Bonus -> One more thing
        // // check the list length again after newly retrieving the list
        // // showcase internal control re-use! (no additional roundtrips)
        wdi5().getLogger().log("--- fist getAggregation done --- start second execution ---");
        const items2 = browser.asControl(listSelector).getAggregation('items');
        expect(items2.length === items.length).toBeTruthy()
    });

});
