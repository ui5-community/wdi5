// @ts-check
const logger = require("./Logger");
const Utils = require('./Utils');
const fs = require('fs');
const path = require('path');

module.exports = class NativeUtils extends Utils {

    static _instance;
    webcontext = "";
    path = {
        android: "file:///android_asset/www/index.html",
        // TODO: add path spec
        ios: "file:///tbd/www/index.html",
        electron: "file:///tbd/www/index.html",
    }

    /**
     * @param {String} webcontext webcontext Id
     */
    constructor(webcontext) {
        super(driver);

        if (this._instance && (webcontext === this.webcontext)) {
            if (webcontext !== this.webcontext) {
                logger.error(`reintiantiation with wrong webcontext, webcontext was: ${this.webcontext} new appis is: ${webcontext} !`);
                this.initSuccess = false;
            }

            return this._instance;
        }

        this.webcontext = webcontext;
        this._instance = this
        return this._instance;
    };

    /**
     * TODO:
     * @param {*} hash
     */
    goTo(hash) {
        if (this.getConfig("platform") === "android") {
            this.context.url(`${this.path.android}${hash}`);
        } else if (this.getConfig("platform") === "ios") {
            this.context.url(`${this.path.ios}${hash}`);
        } else if (this.getConfig("platform") === "electron") {
            this.context.url(`${this.path.electron}${hash}`);
        }
    };

    /**
     *
     * @param {*} webcontext
     */
    _setWebcontext(webcontext) {
        this.webcontext = webcontext
    };

    /**
     *
     */
    logContexts() {
        if (this.initSuccess) {
            logger.log("--- start logging contexts ---")
            logger.log("all Contexts: " + this.context.getContexts());
            logger.log("current Context: " + this.context.getContext());
            logger.log("--- end logging contexts ---")
        } else {
            logger.error("init of utils failed")
        }
    };

    /**
     *
     * @param {*} fileAppendix
     */
    takeScreenshot(fileAppendix) {
        if (this.initSuccess) {
            this.context.setTimeout({ 'implicit': 500 });

            // We need to switch to the native context for the screenshot to work
            this.context.switchContext('NATIVE_APP');
            logger.log("current Context: " + this.context.getContext());

            // browser.screenshot returns the screenshot as a base64 string
            const screenshot = this.context.takeScreenshot();
            const seed = this.getDateString();

            let path = this.getConfig("screenshotPath");
            if (path === undefined || path.length === 0) {
                path = this.pjsonPackage.screenshotPath;
            }

            if (fileAppendix.length > 0) {
                fileAppendix = "-" + fileAppendix;
            }

            // sync
            // fs.writeFileSync(`${path}/screenshot-${seed}.png`, screenshot, "base64");

            // async
            fs.writeFile(`${path}/${seed}-screenshot-${fileAppendix}.png`, screenshot, 'base64', function (err) {
                if (err) {
                    logger.error(err);
                } else {
                    logger.log('File created');
                }
            });

            // switch back to continue web testing
            this.context.switchContext(this.webcontext);
            logger.log("current Context: " + this.context.getContext());

        } else {
            logger.error("init of utils failed")
        }
    }
};

