const assert = require('assert');
const wdi5 = require('../../../../../index');

describe('ui5 plugin', () => {
    const viewName = 'test.Sample.view.Main';

    it('test the mocked cordova barcodescanner plugin', () => {

        // ui5
        const buttonselector = {
            selector: {
                id: 'barcodescannerplugin',
                viewName: viewName
            }
        };

        const inputSelector = {
            selector: {
                id: 'barcodeValue',
                viewName: viewName
            }
        };

        const button = browser.asControl(buttonselector);
        // open the barcode scanner
        button.press();

        const input = browser.asControl(inputSelector);
        // the app function passes the scan into the model and bind to the input value
        // 123123 is as configured in the wdio.conf file
        assert.equal('123-123-asd', input.getProperty('value'));
    });

    it('test the mocked cordova barcodescanner plugin with dynamic response', () => {

        // set the dynamic reponse
        const res = {
            scanCode: '123-123-asd-dynamic',
            format: "QrCode",
        }

        // browser.executeAsync((res, done) => {
        //     window.wdi5.setPluginMockReponse('phonegap-plugin-barcodescanner', res)
        //     done();
        // }, res);

        wdi5().getCordovaMockPluginFactory().setPluginMockReponse('phonegap-plugin-barcodescanner', res);

        // ui5
        const buttonselector = {
            selector: {
                id: 'barcodescannerplugin',
                viewName: viewName
            }
        };

        const inputSelector = {
            selector: {
                id: 'barcodeValue',
                viewName: viewName
            }
        };

        const button = browser.asControl(buttonselector);
        // open the barcode scanner
        button.press();

        const input = browser.asControl(inputSelector);
        // the app function passes the scan into the model and bind to the input value
        // 123123 is as configured in the wdio.conf file
        assert.equal(res.scanCode, input.getProperty('value'));
    });
});
