// @ts-check

const fs = require('fs');
const Utils = require('./Utils')

// Singleton
module.exports = class BrowserUtil extends Utils {

    static _instance;

    /**
     */
    constructor() {
        super(browser);

        if (this._instance) {
            return this._instance;
        }
        this._instance = this
        return this._instance;
    };

    takeScreenshot(fileAppendix) {
        if (this.initSuccess) {

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

            fs.writeFile(`${path}/${seed}-screenshot-${fileAppendix}.png`, screenshot, 'base64', function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('File created');
                }
            });

        } else {
            console.error("init of utils failed")
        }
    };
};
