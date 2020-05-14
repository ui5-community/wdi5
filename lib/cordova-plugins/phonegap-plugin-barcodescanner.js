const factory = require('./factory');

module.exports = (function () {
    // name as in cordova
    _pluginName = 'phonegap-plugin-barcodescanner';

    /**
     * call to init plugin mock feature for Browser
     */
    _setupBrowser = function () {
        // mock funtions
        if (cordova && cordova.plugins && cordova.plugins.barcodeScanner) {
            cordova.plugins.barcodeScanner.scan = function (success, error) {
                if (success) {
                    success('success');
                } else if (error) {
                    error('error');
                }
            };
        }
    };

    /**
     * call to init plugin mock feature for iOS
     */
    _setupIos = function () {
        // mock funtions
        if (cordova && cordova.plugins && cordova.plugins.barcodeScanner) {
            cordova.plugins.barcodeScanner.scan = function (success, error) {
                if (success) {
                    success('success');
                } else if (error) {
                    error('error');
                }
            };
        }
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
