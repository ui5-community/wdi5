// @ts-check


module.exports = class Util {

    context = {};
    initSuccess = false;
    pjsonPackage = require(`./../package.json`);

    /**
     * @type Abstract: Do not instantiate -> use the child classes !!!
     * @param {object} context bla fasel
     */
    constructor(context) {
        if (context) {
            // todo: validate input
            this.initSuccess = true;
        }
        if (this.initSuccess) {
            this.context = context;
        }
    };

    /**
     * if property is provided the value of property will be returned
     * if no property is provided the whole config will be returned.
     * @param {*} property
     */
    getConfig(property) {
        if (this.initSuccess) {
            if (property) {
                try {
                    return this.context.config.wdi5[property];
                } catch (e) {
                    console.error(e);
                }
            }
            return this.context.config.wdi5;
        } else {
            console.error("init of utils failed")
        }
    };

    logContexts() {
        console.log("Not working in this environment !!!");
    };

    takeScreenshot() {
        console.log("Not working in this environment !!!");
    }
};
