// @ts-check
const fs = require('fs');
const logger = require('./Logger');
const path = require('path');
const Utils = require('./Utils');
const wdioUi5 = require('./wdioUi5-index')

// Singleton
module.exports = class BrowserUtil extends Utils {
    static _instance;
    path = {
        electron: `${this.context.getUrl()}`,
        currentPath: ''
    };

    /**
     */
    constructor() {
        super(browser);

        if (this._instance) {
            return this._instance;
        }

        // not path needed for browser
        if (this.getConfig('path') && this.getConfig('path').length > 0) {
            logger.warn(
                'for this device (browser) no navigation path is needed, path: ',
                this.getConfig('path'),
                'not used'
            );
        }

        if (this.getConfig('platform') === 'electron') {
            this.path.currentPath = this.path.electron;
        } else {
            // stay with empty string for current path for browser
        }

        this._instance = this;
        return this._instance;
    }

    /**
     * navigates in the application to a given hash
     * @param {String} hash
     */
    goTo(hash) {
        logger.log(`Navigating to: ${this.path.currentPath}${hash}`);
        this.context.url(`${this.path.currentPath}${hash}`);

        // electron needs to have the wdi5 injected after navigation
        if (this.getConfig('platform') === 'electron') {
            wdioUi5.injectUI5(browser);
        }
    }

    /**
     * store a screenshot (as png) in a directory
     * @param {String} fileAppendix postfixed (to screenshot filename) custom identifier for the screenshot
     */
    takeScreenshot(fileAppendix) {
        if (this.initSuccess) {

            // make sure the ui is fully loaded
            wdioUi5.waitForUI5();

            // browser.screenshot returns the screenshot as a base64 string
            const screenshot = this.context.takeScreenshot();
            const seed = this.getDateString();

            let _path = this.getConfig('screenshotPath');
            if (_path === undefined || _path.length === 0) {
                _path = this.pjsonPackage.screenshotPath;
            }

            if (fileAppendix.length > 0) {
                fileAppendix = '-' + fileAppendix;
            }

            const platform = this.getConfig('platform');

            // make path cross-platform
            _path = path.resolve(_path, `${seed}-${platform}-${fileAppendix}.png`);
            fs.writeFile(_path, screenshot, 'base64', function (err) {
                if (err) {
                    logger.error(err);
                } else {
                    logger.log(`screenshot at ${_path} created`);
                }
            });
        } else {
            logger.error('init of utils failed');
        }
    }
};
