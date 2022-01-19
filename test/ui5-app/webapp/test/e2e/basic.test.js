const wdi5 = require('wdi5');
const Main = require('./pageObjects/Main');

describe('ui5 basic', () => {
    globalThis.viewName = 'test.Sample.view.Main';

    before(async () => {
        await Main.open();
    });

    beforeEach(async () => {
        const _wdi5 = await wdi5();
        _wdi5.getLogger().log('beforeEach');
        _wdi5.getUtils().screenshot('test-basic');
    });

    it('should input date via popup + click', async () => {
        const dateTimePicker = {
            forceSelect: true,
            selector: {
                viewName: 'test.Sample.view.Main',
                id: 'idDateTime'
            }
        };

        const popupIcon = {
            selector: {
                id: /.*idDateTime-icon$/,
                viewName: 'test.Sample.view.Main'
            }
        };
        await browser.asControl(popupIcon).firePress();

        const d = new Date();
        const yeaterdayDay = d.getDate() - 1;
        const todayMonth = d.getMonth().toString().length === 1 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
        const todayYear = d.getFullYear();

        const date = $(`//*[contains(@id, "idDateTime-cal--Month0-${todayYear}${todayMonth}${yeaterdayDay}")]`); // wdio-native
        date.click();

        const ok = $('//*[contains(@id, "idDateTime-OK")]'); // wdio-native
        ok.click();

        const oDateTimePicker = await browser.asControl(dateTimePicker); // wdi5 again!
        const value = await oDateTimePicker.getValue();

        expect(value).toMatch(new RegExp(`${todayYear}`));
        expect(value).toMatch(new RegExp(`${yeaterdayDay}`));
    });

    // TODO: make this work -> see #106
    it.skip('should find a control with visible: false', async () => {
        const id = 'invisibleInputField';

        // wdio-native selector
        const wdioInput = await browser.$(`[id$="${id}"]`);
        expect(await wdioInput.getProperty('id')).toContain('sap-ui-invisible');

        const selector = {
            selector: {
                id,
                controlType: 'sap.m.Input',
                viewName: globalThis.viewName,
                visible: false
            }
        };
        const input = await browser.asControl(selector);
        expect(await input.getVisible()).toBe(false);

        await input.setVisible(true);
        expect(await input.getVisible()).toBe(true);
    });

    it('should have the right title', async () => {
        const title = await browser.getTitle();
        expect(title).toEqual('Sample UI5 Application');
    });

    it('should find a ui5 control class via .hasStyleClass', async () => {
        // webdriver
        const className = 'myTestClass';

        // ui5
        const selector = {
            wdio_ui5_key: 'buttonSelector',
            selector: {
                bindingPath: {
                    modelName: 'testModel',
                    propertyPath: '/buttonText'
                },
                viewName: globalThis.viewName,
                controlType: 'sap.m.Button'
            }
        };

        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            selector.forceSelect = true;
            selector.selector.interaction = 'root';
        }

        const control = await browser.asControl(selector);
        const retrievedClassNameStatus = await control.hasStyleClass(className);

        (await wdi5()).getLogger().log('retrievedClassNameStatus', retrievedClassNameStatus);
        expect(retrievedClassNameStatus).toBeTruthy();
    });
});
