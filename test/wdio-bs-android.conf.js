const path = require('path');
const request = require("request");

const userName = "dominikfeininger1";
const accessKey = "UALtTysmS7U8ve56Zb12"
const browserstackURL = "http://hub-cloud.browserstack.com/wd/hub";

exports.config = {

    // https://www.browserstack.com/docs/automate/selenium/getting-started/nodejs/webdriverio
    user: userName,
    key: accessKey,
    // forceLocal: true,

    capabilities: [
        {
            // "browserstack.local": true,
            automationName: 'UiAutomator2',
            'browserstack.debug': true,
            'browserstack.video': true,
            project: 'wdi5',
            build: '0.1.0',
            name: 'wdi5',
            build: 'Node Android 10 emulator',
            os_version: "10.0",
            name: 'wdi5 test',
            "browserstack.acceptInsecureCerts": true,
            "browserstack.deviceLogs": true,
            device: 'Google Pixel 3',
            app: 'bs://68e020a64b2d163d93c6cb5116e608127df46391',
            'chromeOptions': { "w3c": false },
            autoWebview: true,
            autoGrantPermissions: true,
            real_mobile: false,
            //https://github.com/webdriverio/webdriverio/issues/3264
            'browserstack.appium_version': '1.17.0'
        }
    ],

    reporters: ['spec'],
    framework: 'mocha',
    logLevel: 'trace',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
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
            // TODO: custom path to plugins
            'phonegap-plugin-barcodescanner': {
                respObjIos: {
                    text: '123-123-asd',
                    format: 'EAN',
                    cancelled: ''
                },
                respObjAndroid: {
                    text: '123-123-asd',
                    format: 'EAN',
                    cancelled: ''
                },
                scanCode: '123-123-asd',
                format: 'EAN'
            },
            'custom-plugin': {
                path: "./test/plugins/custom-plugin.js"
            }
        }
    },

    before: function (capabilities, specs) {
        const wdi5 = require('../index');

        // todo -> move to wdi5?
        driver.setAsyncTimeout(6000);

        // call once to init
        // assume the start context is the webcontext -> "js.appiumTest"
        // first call need to be with the webcontext
        wdi5(driver, driver.getContext());

        driver.switchContext(driver.getContext());

        // log the config
        wdi5()
            .getLogger()
            .log('configurations: ' + JSON.stringify(wdi5().getUtils().getConfig()));

        wdi5()
            .getLogger()
            .log('driver context url: ' + driver.getUrl());
    },
    /*
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    after: function (result, capabilities, specs) {
        // load module
        const wdi5 = require('../index');
        console.log('after hook');
        if (result === 1) {
            wdi5().getLogger().error('some tests failed');
            // test failed
            if (wdi5().getUtils().getConfig('logLevel') !== 'verbose') {
                wdi5().getLogger().error('here is the full log');
                // write log if loglevel is other than verbose
                wdi5().getLogger().printLogStorage();
            }
        } else {
            request({ uri: "https://dominikfeininger1:UALtTysmS7U8ve56Zb12@api.browserstack.com/automate/sessions/<session-id>.json", method: "PUT", form: { "status": "completed", "reason": "" } })
        }
    }
};
