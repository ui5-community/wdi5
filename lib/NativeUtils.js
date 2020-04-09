// @ts-check
/* global driver */

const Utils = require('./Utils');
const fs = require('fs');
const path = require('path');

module.exports = class NativeUtils extends Utils {

    static _instance;
    webcontext = "";

    /**
     * @param {String} webcontext webcontext Id
     */
    constructor(webcontext) {
        super(driver);

        if (this._instance && (webcontext === this.webcontext)) {
            if (webcontext !== this.webcontext) {
                console.error(`reintiantiation with wrong webcontext, webcontext was: ${this.webcontext} new appis is: ${webcontext} !`);
                this.initSuccess = false;
            }

            return this._instance;
        }

        this.webcontext = webcontext;
        this._instance = this
        return this._instance;
    };

    logContexts() {
        if (this.initSuccess) {
            console.log("--- start logging contexts ---")
            console.log("all Contexts: " + this.context.getContexts());
            console.log("current Context: " + this.context.getContext());
            console.log("--- end logging contexts ---")
        } else {
            console.error("init of utils failed")
        }
    };

    takeScreenshot(fileAppendix) {
        if (this.initSuccess) {
            this.context.setTimeout({ 'implicit': 500 });

            // We need to switch to the native context for the screenshot to work
            this.context.switchContext('NATIVE_APP');
            console.log("current Context: " + this.context.getContext());

            // browser.screenshot returns the screenshot as a base64 string
            const screenshot = this.context.takeScreenshot();
            const seed = new Date().getUTCMilliseconds();

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
            fs.writeFile(`${path}/screenshot-${seed}${fileAppendix}.png`, screenshot, 'base64', function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('File created');
                }
            });

            // switch back to continue web testing
            this.context.switchContext(this.webcontext);
            console.log("current Context: " + this.context.getContext());

        } else {
            console.error("init of utils failed")
        }
    }
};

