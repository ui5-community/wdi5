const factory = require('./factory');

/**
 * Function to call to retrieve wdi5.plugin.config
 * Be aware that the context differs inside the passed function to factory.registerPlugin to this files' context. This means, that eg. the member `_pluginName` is not available.
 * 1. function window.wdi5.getPluginConfigForPluginWithProperty(pluginName, property) can be used to retrieve a property form the plugin config.
 * OR
 * 2. function window.wdi5.getPluginConfigForPlugin(pluginName) can be used to retrieve the whole config form the plugin config.
 */
module.exports = (() => {
    // name as in cordova
    _pluginName = 'phonegap-plugin-barcodescanner';

    /**
     * call to init plugin mock feature for Browser
     */
    _setupBrowser = () => {
        if (!cordova.plugins.barcodeScanner) {
            cordova.plugins.barcodeScanner = {};
        }
        // mock funtions
        cordova.plugins.barcodeScanner.scan = (success, error, oOptions) => {
            if (success) {
                // load dynamic value, returns undefined if the setter function was not called before
                let result = window.wdi5.getPluginMockResponse('phonegap-plugin-barcodescanner');

                // if no value available try to set static config
                if (!result) {
                    result = window.wdi5.getPluginConfigForPlugin('phonegap-plugin-barcodescanner');
                }

                success(result);
            } else if (error) {
                error('phonegap-plugin-barcodescanner: mocking error');
            }
        };
    };

    /**
     * call to init plugin mock feature for iOS
     */
    _setupIos = () => {
        // mock funtions
        if (!cordova.plugins.barcodeScanner) {
            cordova.plugins.barcodeScanner = {};
        }
        cordova.plugins.barcodeScanner.scan = (success, error, oOptions) => {
            if (success) {
                const result = window.wdi5.getPluginConfigForPlugin('phonegap-plugin-barcodescanner');
                success(result);
            } else if (error) {
                error('phonegap-plugin-barcodescanner: mocking error');
            }
        };
    };

    /**
     * call to init plugin mock feature for Android
     */
    _setupAndroid = () => {
        // mock funtions
        if (!cordova.plugins.barcodeScanner) {
            cordova.plugins.barcodeScanner = {};
        }
        cordova.plugins.barcodeScanner.scan = (success, error, oOptions) => {
            if (success) {
                const result = window.wdi5.getPluginConfigForPlugin('phonegap-plugin-barcodescanner');
                success(result);
            } else if (error) {
                error('phonegap-plugin-barcodescanner: mocking error');
            }
        };
    };

    /**
     * call to init plugin mock feature for Electron
     */
    _setupElectron = () => {
        // mock funtions
        if (!cordova.plugins.barcodeScanner) {
            cordova.plugins.barcodeScanner = {};
        }
        cordova.plugins.barcodeScanner.scan = (success, error) => {
            if (success) {
                const result = window.wdi5.getPluginConfigForPlugin('phonegap-plugin-barcodescanner');
                success(result);
            } else if (error) {
                error('phonegap-plugin-barcodescanner: mocking error');
            }
        };
    };

    /**
     * register plugin on factory
     * the passed function will be executed in the webcontext and thus all defined objects will be attached to the webcontext
     */
    _register = () => {
        factory.registerPlugin(_pluginName, 'browser', _setupBrowser);
        factory.registerPlugin(_pluginName, 'ios', _setupIos);
        factory.registerPlugin(_pluginName, 'android', _setupAndroid);
        factory.registerPlugin(_pluginName, 'electron', _setupElectron);
    };

    // execute the _register function
    _register();
})();
