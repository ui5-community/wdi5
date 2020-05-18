// @ts-check
const logger = require('./Logger');

/**
 * Abstract super class
 */
module.exports = class Util {
    context = {};
    initSuccess = false;
    pjsonPackage = require(`./../package.json`);

    /**
     * @abstract: Do not instantiate -> use the child classes !!!
     * @param {object} context bla fasel
     */
    constructor(context) {
        if (context) {
            this.initSuccess = true;
        }
        if (this.initSuccess) {
            this.context = context;
        }
    }

    /**
     * generates date string with format M-d-hh-mm-ss
     * @returns {String}
     */
    getDateString() {
        var x = new Date();
        return `${x.getMonth() + 1}-${x.getDate()}-${x.getHours()}-${x.getMinutes()}-${x.getSeconds()}`;
    }

    getPluginConfigForPlugin(pluginName) {
        if (this.initSuccess) {
            return this.context.config.wdi5.plugins[pluginName];
        } else {
            logger.error('init of utils failed');
        }
    }

    /**
     * if property is provided the value of property will be returned
     * if no property is provided the whole config will be returned.
     * @param {String} property
     */
    getConfig(property) {
        if (this.initSuccess) {
            if (property) {
                try {
                    return this.context.config.wdi5[property];
                } catch (e) {
                    logger.error(e);
                }
            }
            return this.context.config.wdi5;
        } else {
            logger.error('init of utils failed');
        }
    }
};
