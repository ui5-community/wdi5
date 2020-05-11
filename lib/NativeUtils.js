// @ts-check
const logger = require('./Logger');
const fs = require('fs');
const Utils = require('./Utils');
const path = require('path');

module.exports = class NativeUtils extends Utils {
    static _instance;
    webcontext = '';
    path = {
        // TODO: add const variables in spec file and add path spec, remove "tbd"
        android: 'file:///android_asset/www/index.html',
        ios: 'file:///tbd/www/index.html',
        electron: 'file:///tbd/www/index.html',
        currentPath: ''
    };

    /**
     * @param {String} webcontext webcontext Id
     */
    constructor(webcontext) {
        super(driver);

        if (this._instance && webcontext === this.webcontext) {
            if (webcontext !== this.webcontext) {
                logger.error(
                    `reintiantiation with wrong webcontext, webcontext was: ${this.webcontext} new appis is: ${webcontext} !`
                );
                this.initSuccess = false;
            }

            return this._instance;
        }

        // override the standard path if it was set in config
        if (this.getConfig('path') && this.getConfig('path').length > 0) {
            this.path.currentPath = this.getConfig('path');
        } else {
            if (this.getConfig('platform') === 'android') {
                this.path.currentPath = this.path.android;
            } else if (this.getConfig('platform') === 'ios') {
                this.path.currentPath = this.path.ios;
            } else if (this.getConfig('platform') === 'electron') {
                this.path.currentPath = this.path.electron;
            } else {
                // no platform defined
                logger.warn('no platform defined in config -> navigation might not work !');
            }
        }

        this.webcontext = webcontext;
        this._instance = this;
        return this._instance;
    }

    /**
     * navigates in the application to a given hash
     * @param {String} hash
     */
    goTo(hash) {
        this.context.url(`${this.path.currentPath}${hash}`);
    }

    /**
     *
     * @param {*} webcontext
     */
    _setWebcontext(webcontext) {
        this.webcontext = webcontext;
    }

    /**
     *
     */
    logContexts() {
        if (this.initSuccess) {
            logger.log('--- start logging contexts ---');
            logger.log('all Contexts: ' + this.context.getContexts());
            logger.log('current Context: ' + this.context.getContext());
            logger.log('--- end logging contexts ---');
        } else {
            logger.error('init of utils failed');
        }
    }

    /**
     * store a screenshot (as png) in a directory
     * @param {String} fileAppendix postfixed (to screenshot filename) custom identifier for the screenshot
     */
    takeScreenshot(fileAppendix) {
        if (this.initSuccess) {
            this.context.setTimeout({implicit: 500});

            // We need to switch to the native context for the screenshot to work
            this.context.switchContext('NATIVE_APP');
            logger.log('current Context: ' + this.context.getContext());

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

            // sync
            // fs.writeFileSync(`${path}/screenshot-${seed}.png`, screenshot, "base64");

            // make path cross-platform
            _path = path.resolve(_path, `${seed}-screenshot-${fileAppendix}.png`);
            // async
            fs.writeFile(_path, screenshot, 'base64', function (err) {
                if (err) {
                    logger.error(err);
                } else {
                    logger.log(`screenshot at ${_path} created`);
                }
            });

            // switch back to continue web testing
            this.context.switchContext(this.webcontext);
            logger.log('current Context: ' + this.context.getContext());
        } else {
            logger.error('init of utils failed');
        }
    }
};
