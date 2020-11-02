const path = require('path');
const request = require("request");
require('dotenv').config()
const WDI5Service = require('../wdi5/lib/service/wdi5.service')

const _userName = process.env.USERNAME
const _accessKey = process.env.ACCESSKEY
const _apphash = process.env.APPHASH_ANDROID;

exports.config = {

    // https://www.browserstack.com/docs/automate/selenium/getting-started/nodejs/webdriverio
    user: _userName,
    key: _accessKey,
    // forceLocal: true,

    capabilities: [
        {
            'browserstack.use_w3c': true,
            // "browserstack.local": true,
            // https://github.com/webdriverio/webdriverio/issues/3264
            'browserstack.appium_version': '1.17.0',
            'browserstack.debug': true,
            'browserstack.video': true,
            "browserstack.acceptInsecureCerts": true,
            "browserstack.deviceLogs": true,
            automationName: 'UiAutomator2',
            project: 'wdi5',
            build: '0.1.0',
            name: 'wdi5',
            build: 'Android',
            os_version: "10.0",
            name: 'wdi5 Android',
            device: 'Google Pixel 3',
            app: 'bs://' + _apphash,
            chromeOptions: { "w3c": false },
            autoWebview: true,
            autoGrantPermissions: true
        }
    ],

    reporters: ['spec'],
    framework: 'mocha',
    logLevel: 'trace',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: [
        [WDI5Service]
    ],
    sync: true,
    mochaOpts: {
        timeout: 90000
    },
    specs: [path.join('test', 'ui5-app', 'webapp', 'test', 'e2e', '*.js')],

    wdi5: {
        screenshotPath: path.join('test', 'report', 'screenshots'),
        deviceType: 'native',
        logLevel: 'verbose',
        platform: 'android',
        capabilities: {
            rotate: true,
            camera: 2
        },
        plugins: {
            'phonegap-plugin-barcodescanner': {
                scanCode: '123-123-asd',
                format: 'EAN',
                cancelled: ''
            },
            'custom-plugin': {
                path: path.join('test', 'plugins', 'custom-plugin.js')
            }
        }
    },

    before: function (capabilities, specs) {
        // needs to be done for Browserstack
        driver.switchContext(driver.getContext());
    },
};
