const logger = require('../Logger');

/**
 * plugin mock factory
 * to create a proper abstraction for the test, the thest does not neet to know whrer it's mocks come from
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
     * @param pluginName {String}
     * @param plugin {cordova plugin}
     */
    registerPlugin: function (pluginName, platform, setupFunction) {
        if (!this._pluginList[platform][pluginName]) {
            // register new plugin
            this._pluginList[platform][pluginName] = setupFunction;
            this._callPluginSetup(setupFunction);
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

    _loadPluginWithName: function (pluginName) {
        // load from plugin config list
        return require(`./${pluginName}`);
    },

    /**
     * call setup on each registered plugin
     */
    _callPluginSetup: function (setupFunction) {
        const sSetupFunction = '(' + setupFunction.toString() + ')()';

        return this._context.executeAsync((sSetupFunction, done) => {
            debugger;
            eval(sSetupFunction)();
            // attach
            done(true);
        }, sSetupFunction);
    }
};
