const BrowserUtils = require('./lib/BrowserUtils');
const NativeUtils = require('./lib/NativeUtils');
const wdioUI5 = require("./lib/wdio-ui5");
let _instance = null;

class WDI5 {

    _utilInstance = null;
    deviceType = "";

    /**
     * FACTORY
     * @param {*} webcontext String
     */
    constructor(webcontext) {

        // create new instance
        // doesn't matter if read from browser or dervice -> device independent
        if (browser.config) {
            this.deviceType = browser.config.wdi5 ? browser.config.wdi5.deviceType : "native"; // {web | native}
        } else if (driver.config) {
            // just to make sure anyways
            this.deviceType = driver.config.wdi5 ? driver.config.wdi5.deviceType : "native"; // {web | native}
        } else {
            console.error("no config found something went terribly wrong during the initialitation of the wdconf !");
        }

        if (this.deviceType === "web") {
            this._utilInstance = new BrowserUtils();
        } else if (this.deviceType === "native") {
            this._utilInstance = new NativeUtils(webcontext);
        } else {
            console.error(`requested device type: ${deviceType} is not supported use one of type (String): {web | native} instead`)
        }

        if (!this._utilInstance) {
            console.error("WDI5 Utils were not created correctly");
        }
        return this;
    }

    /**
     * return the instantiated utils
     */
    getUtils() {
        return this._utilInstance;
    }

    /**
     * retrun the static wdioUI5 bridge
     */
    getWDioUi5() {
        return wdioUI5;
    }
}

module.exports = (webcontext) => {
    if (!_instance) {
        // create new if parameters are supplied
        _instance = new WDI5(webcontext);
    } else if (webcontext && (_instance.getUtils() instanceof NativeUtils)) {
        // WDI5 instance already exists but new webcontext is provided
        console.log("update with provided webcontext")
        _instance.getUtils().webcontext = webcontext;
    }

    return _instance;
}
