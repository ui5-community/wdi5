const assert = require('assert');
const wdi5 = require('../../../../index');

describe('ui5 showcase app - ui5 checkbox test', () => {
    before(() => {
        // wdi5().getutils().goTo('');
    });

    it('should CHECK the checkbox', () => {
        const cbSelector1 = {
            wdio_ui5_key: 'cbSelector1',
            selector: {
                // id: "idCheckbox",
                bindingPath: {
                    modelName: 'testModel',
                    propertyPath: '/checkbox'
                },
                viewName: 'test.Sample.view.Main',
                controlType: 'sap.m.CheckBox'
            }
        };
        const ui5checkBox1 = browser.asControl(cbSelector1);

        ui5checkBox1.setProperty('selected', true);
        ui5checkBox1.fireEvent('select'), { selected: true };

        assert.ok(ui5checkBox1.getProperty('selected'));
    });

    it('should unCHECK the checkbox', () => {
        const cbSelector2 = {
            wdio_ui5_key: 'cbSelector2',
            selector: {
                // id: "idCheckbox",
                bindingPath: {
                    modelName: 'testModel',
                    propertyPath: '/checkbox'
                },
                viewName: 'test.Sample.view.Main',
                controlType: 'sap.m.CheckBox'
            }
        };
        const ui5checkBox2 = browser.asControl(cbSelector2);

        ui5checkBox2.setProperty('selected', false);
        ui5checkBox2.fireEvent('select', { selected: false });

        assert.ok(!ui5checkBox2.getProperty('selected'));
    });
});
