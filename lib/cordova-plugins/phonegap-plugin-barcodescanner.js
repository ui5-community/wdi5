const factory = require('./factory');
const _ = require('../../index');

module.exports = (function () {
    // name as in cordova
    _pluginName = 'phonegap-plugin-barcodescanner';

    /**
     * call to init plugin mock feature for Browser
     */
    _setupBrowser = function () {
        if (!cordova.plugins.barcodeScanner) {
            cordova.plugins.barcodeScanner = {};
        }
        // mock funtions
        cordova.plugins.barcodeScanner.scan = function (success, error) {
            if (success) {
                const result = {
                    text: window.wdi5.getPluginConfigForPluginWithProperty(
                        'phonegap-plugin-barcodescanner',
                        'scanCode'
                    ),
                    format: window.wdi5.getPluginConfigForPluginWithProperty(
                        'phonegap-plugin-barcodescanner',
                        'format'
                    ),
                    cancelled: window.wdi5.getPluginConfigForPluginWithProperty(
                        'phonegap-plugin-barcodescanner',
                        'cancelled'
                    )
                };
                success(result);
            } else if (error) {
                error('mocking an error');
            }
        };
    };

    /**
     * call to init plugin mock feature for iOS
     */
    _setupIos = function () {
        // mock funtions
        if (!cordova.plugins.barcodeScanner) {
            cordova.plugins.barcodeScanner = {};
        }
        cordova.plugins.barcodeScanner.scan = function (success, error) {
            if (success) {
                const result = window.wdi5.getPluginConfigForPluginWithProperty(
                    'phonegap-plugin-barcodescanner',
                    'respObjIos'
                );
                success(result);
            } else if (error) {
                error('mocking an error');
            }
        };
    };

    /**
     * register plugin on factory
     */
    _register = function () {
        factory.registerPlugin(this._pluginName, 'browser', _setupBrowser);
        factory.registerPlugin(this._pluginName, 'ios', _setupIos);
    };

    // execute the _register function
    _register();
})();
