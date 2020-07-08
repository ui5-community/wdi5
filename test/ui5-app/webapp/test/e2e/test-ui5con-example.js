const wdi5 = require('../../../../../index'); // require('wdi5')

// describe the tests we do
describe('ui5con example - screenshot, plugin mock, interaction, control aggregation', () => {

    // #0. Screenshot before and after each testcase execution
    beforeEach(() => {
        // take screenshot with string: ui5con-before-test
        // #action
        wdi5().getUtils().takeScreenshot("ui5con-before-test")

    });

    afterEach(() => {
        // file is created with date - time - platform - name
        wdi5().getUtils().takeScreenshot("ui5con-after-test")
    })

    it('#1. should showcase the fingerprint', () => {
        // the tested plugin is only available for android and ios -> test if current test execution runs on a native device
        const deviceType = wdi5().getUtils().getConfig("deviceType");
        if (deviceType === "native") {

            // 1. press the button identified with id "onBoo"
            const buttonSelector = {
                selector: {
                    id: 'onBoo',
                    viewName: 'test.Sample.view.Main',
                    controlType: 'sap.m.Button'
                }
            }

            // 2. retrieve the button
            // `browser` is wdio-native, `asControl` is wdi5 (~UIveri5)
            const ui5Button = browser.asControl(buttonSelector)

            // 2.1 press the button
            ui5Button.press()


            // 3. check the text change
            // 3.1 create text selector by binding path testModel > / fingerprint
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
            const ui5AuthenticationMessage = browser.asControl(textSelector)

            // 5. expect the text to display an successfull authentication with string "Authentication successful"
            // getText method from the UI5 stack
            expect(ui5AuthenticationMessage.getText()).toStrictEqual("Authentication successful")
        }
    });

    it('#2. should navigate to "Other" view by button press', () => {
        // Three step process
        // 1. create property selector by icon "sap-icon://forward"
        const buttonSelector = {
            selector: {
                // #action
            }
        }

        // 2. retrieve the button from browser context as fwdButton
        // #action

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

    it('#3. get aggregation and validate items', () => {
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

        // #3. check all items are bound check the length
        expect(items.length).toStrictEqual(allNames.length);

        // #4. test each of the names matches the the static assumption array
        // loop though retrieved controls and validate entries
        items.forEach((item, i) => {
            // sequential run since the order does not change
            expect(allNames[i]).toStrictEqual(item.getProperty('title'));
        })

        // // Bonus -> One more thing
        // check the list length again after newly retrieving the list
        // showcase internal control re-use! (no additional roundtrips)
        // #action
    });

});
