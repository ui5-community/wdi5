const logger = require('../Logger');

/**
 * plugin mock factory
 * to create a proper abstraction for the test, the test does not neet to know whrere it's mocks come from !
 *
 * * How to mock a plugin
 * ----------------------
 * 1. Write its name, need to match the cordova plugin name and the actual mock filename, into the `wdi5: plugins: <pluginname>` config.
 * 1.1 This triggers the load of the javascript file
 *
 * 2. Implement the plugin mock to override the needed plugin javascript functions, and call the `registerPlugin` function of the plugin factory. The third parameter is the critical:
 * The function passed to the register function will be executed in the browser's webapp context!
 * 2.1 This will trigger an attach of the mck funtions to the web app browser context.
 *
 * 3. The mock function will be automatically called by the app
 */
module.exports = {
    // Object of plugin names read from config
    _pluginListConfig: {},
    // instanziated list of plugins
    _pluginList: {
        android: {},
        ios: {},
        browser: {},
        electron: {}
    },
    //
    _: null,
    _context: null,
    // name of platform under test
    _platform: '',

    /**
     * call to trigger the init process
     * @param _ {index}
     */
    setup: function (_, context) {
        this._ = _;
        this._context = context;

        this._pluginListConfig = this._getPluginConfig();
        this._platform = this._.getUtils().getConfig('platform');
    },

    /**
     * called by the plugins to register
     * each plugin needs to register itself
     * @param {String} pluginName
     * @param {String} platform
     * @param {function} setupFunction
     */
    registerPlugin: function (pluginName, platform, setupFunction) {
        if (!this._pluginList[platform][pluginName]) {
            // register new plugin
            this._pluginList[platform][pluginName] = setupFunction;
            this._callPluginSetup(pluginName, setupFunction);
        } else {
            // plugin with this name already registered
            logger.error(`plugin with the name: ${pluginName} already registered`);
        }
    },

    /**
     * reads the wdi5 config and saves to the plugin list
     */
    _getPluginConfig: function () {
        const pluginConfigList = this._.getUtils().getConfig('plugins');
        if (pluginConfigList) {
            Object.keys(pluginConfigList).forEach((name) => {
                // load plugin
                this._loadPluginWithName(name);
            });

            return pluginConfigList;
        } else {
            // no plugin config found
            logger.log('no plugins in config defined');
        }
    },

    /**
     * use node require to load a plugin file
     * @param {String} pluginName
     */
    _loadPluginWithName: function (pluginName) {
        // load from plugin config list
        return require(`./${pluginName}`);
    },

    /**
     * call setup on each registered plugin
     */
    _callPluginSetup: function (pluginName, setupFunction) {
        // stringyfy the provided function to be able to inject it to the webapp context
        const sSetupFunction = '(' + setupFunction.toString() + ')';

        const result = this._context.executeAsync(
            (sSetupFunction, pluginName, done) => {
                // create cordova plugin mock as base
                if (!window.cordova) {
                    window.cordova = {
                        plugins: {}
                    };
                }

                try {
                    // attach
                    const result = eval(sSetupFunction)();
                    // call success
                    done(['success', '']);
                } catch (e) {
                    const error = `[browser wdio-ui5] ERR executing the plugin function: ${pluginName}, because of: ${e}`;
                    window.wdi5.Log.error(error);
                    done(['error', error]);
                }
            },
            sSetupFunction,
            pluginName
        );

        if (result[0] === 'success') {
            // do something with the result[1]
        } else if (result[0] === 'error') {
            logger.error(result[1]);
        }
    }
};
