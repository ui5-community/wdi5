const path = require('path');
exports.config = {
    port: 4722,
    maxInstances: 1,
    logLevel: 'error',
    runner: 'local',
    bail: 0,
    path: '/wd/hub',
    capabilities: [], // defined in platform config files
    specs: [path.join('test', 'ui5-app', 'webapp', 'test', 'e2e', '*.js')],     // Where the files we are testing can be found.
    exclude: [],
    services: [], // Use the Appium plugin for Webdriver separately. Run appium separately on the command line.
    waitforTimeout: 60000,
    reporters: ['spec'], // Test runner services
    framework: 'mocha',     // Framework you want to run your specs with.
    mochaOpts: {
        timeout: 90000
    },
    outputDir: path.join('test', 'report', 'logs'),
    capabilities: [
        {
            automationName: 'XCUITest',
            platformName: 'iOS',
            // The version of the Android or iOS system
            platformVersion: '13.5',
            // For iOS, this must exactly match the device name as seen in Xcode.
            deviceName: 'iPhone SE (2nd generation)',
            // Where to find the .apk or .ipa file to install on the device. The exact location
            // of the file may change depending on your Cordova version.
            app: path.join('test', 'ui5-app', 'app', 'platforms', 'ios', 'build', 'emulator', 'UI5.app'),
            // By default, Appium runs tests in the native context. By setting autoWebview to
            // true, it runs our tests in the Cordova context.
            autoWebview: true,
            // display sim window - seems to default to true
            // w/ macOS 10.15.4, iOS sim 11.4.1 (921.9), appium 1.17.1
            isHeadless: false,
            permissions: "{\"sample.app\": {\"camera\": \"yes\",\"notifications\": \"yes\"}}"
        }
    ],
    wdi5: { // wdi5 specific config in this file
        screenshotPath: path.join('test', 'report', 'screenshots'),
        deviceType: 'native', // native | web
        platform: 'ios',
        logLevel: 'error', // silent | error | verbose
        plugins: { // mock
            'phonegap-plugin-barcodescanner': {
                respObjIos: {
                    text: '123123',
                    format: 'EAN',
                    cancelled: ''
                },
                respObjAndroid: {
                    text: '123123',
                    format: 'EAN',
                    cancelled: ''
                }
            },
            'cordova-plugin-fingerprint-aio': {
                path: "./test/plugins/cordova-plugin-fingerprint-aio.js" // points to mock implementation
            }
        }
    },
    // ===== Hooks =====
    before: function (capabilities, specs) {
        driver.setAsyncTimeout(6000);

        // wdi5 specific start
        const wdi5 = require('../index'); // require('wdi5')
        // to init first call need to be with the webcontext
        wdi5(driver, driver.getContext());
        // example logger the config
        wdi5().getLogger().log('configurations: ' + JSON.stringify(wdi5().getUtils().getConfig()));
    }
};
