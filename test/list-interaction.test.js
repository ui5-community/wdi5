const wdi5 = require('wdi5');
const Other = require('./pageObjects/Other');

describe('list interaction', () => {
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

    let wdi5Util;

    before(async () => {
        wdi5Util = (await wdi5()).getUtils();
        await Other.open();

        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            buttonSelector.forceSelect = true;
            buttonSelector.selector.interaction = 'root';
            listSelector.forceSelect = true;
            listSelector.selector.interaction = 'root';
        }
    });

    beforeEach(async () => {
        await wdi5Util.takeScreenshot('list-interaction-before');
    });

    afterEach(async () => {
        await wdi5Util.takeScreenshot('list-interaction-after');
    });

    it('should have the correct list header', async () => {
        const list = await browser.asControl(listSelector);
        expect(await list.getProperty('headerText')).toEqual('...bites the dust!');
    });

    it.only("press a list item to show its' data:key property", async () => {
        // fire click event on a list item
        // it will set the list items' data:key value to the text field
        // the event handler function checks the data:key property of the list item -> manually add this property to the event.
        const list = await browser.asControl(listSelector);
        await list.fireEvent('itemPress', {
            eval: () => {
                return {
                    listItem: {
                        data: () => {
                            return 'Mock Name';
                        }
                    }
                };
            }
        });

        const textFieldSelector = {
            selector: {
                id: 'idTextFieldClickResult',
                viewName: 'test.Sample.view.Other'
            }
        };
        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            textFieldSelector.forceSelect = true;
            textFieldSelector.selector.interaction = 'root';
        }

        const mockedListItemPress = await browser.asControl(textFieldSelector);

        expect(await mockedListItemPress.getText()).toEqual('Mock Name');
    });
});
