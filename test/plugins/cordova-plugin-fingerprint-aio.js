
const _ = require('../../index');

/**
 *
 * Function to call to retrieve wdi5.plugin.config
 * Be aware that the context differs inside the passed function to factory.registerPlugin to this files' context. This means, that eg. the member `_pluginName` is not available.
 * 1. function window.wdi5.getPluginConfigForPluginWithProperty(pluginName, property) can be used to retrieve a property form the plugin config.
 * OR
 * 2. function window.wdi5.getPluginConfigForPlugin(pluginName) can be used to retrieve the whole config form the plugin config.
 */
module.exports = (() => {
    // name as in cordova
    _pluginName = 'cordova-plugin-fingerprint-aio';

    /**
     * call to init plugin mock feature for Browser
     */
    _setup = () => {
        console.log("cordova-plugin-fingerprint-aio loaded")

        // mock funtions
        window.Fingerprint.show = (desc, success, error) => {
            console.log(desc);

            if (success) {
                const result = {
                    text: window.wdi5.getPluginConfigForPluginWithProperty(
                        'cordova-plugin-fingerprint-aio',
                        'id'
                    )
                };
                success(result);
            } else if (error) {
                error('cordova-plugin-fingerprint-aio: mocking error');
            }
        };
    };

    /**
     * register plugin on factory
     * the passed function will be executed in the webcontext and thus all defined objects will be attached to the webcontext
     */
    _register = () => {
        _().getCordovaMockPluginFactory().registerPlugin(_pluginName, 'android', _setup);
        _().getCordovaMockPluginFactory().registerPlugin(_pluginName, 'ios', _setup);
    };

    // execute the _register function
    _register();
})();
