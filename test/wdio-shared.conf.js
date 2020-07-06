const path = require('path');
exports.config = {
    port: 4723,
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
    wdi5: { // wdi5 specific config in this file
        screenshotPath: path.join('test', 'report', 'screenshots'),
        deviceType: 'native', // native | web
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
