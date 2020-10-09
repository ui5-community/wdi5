const wdi5 = require('wdi5');
const Main = require("./pageObjects/Main")

describe('ui5 plugin', () => {
    const viewName = 'test.Sample.view.Main';

    before(() => {
        Main.open();
    })

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
        button.firePress();

        const input = browser.asControl(inputSelector);
        // the app function passes the scan into the model and bind to the input value
        // 123123 is as configured in the wdio.conf file
        expect(input.getProperty('value')).toEqual('123-123-asd');
    });

    it('test the mocked cordova barcodescanner plugin with dynamic response', () => {

        // set the dynamic reponse
        const res = {
            scanCode: '123-123-asd-dynamic',
            format: "QrCode",
        }

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
        button.firePress();

        const input = browser.asControl(inputSelector);
        // the app function passes the scan into the model and bind to the input value
        // 123123 is as configured in the wdio.conf file
        expect(input.getProperty('value')).toEqual(res.scanCode);
    });
});
