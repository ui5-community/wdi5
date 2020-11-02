const path = require('path');
require('dotenv').config()
const WDI5Service = require('../wdi5/lib/service/wdi5.service')

exports.config = {
    // http://appium.io/docs/en/writing-running-appium/caps/

    // 4723 is the default port for Appium
    port: 4723,

    maxInstances: 1,

    // How much detail should be logged. The options are:
    // "trace", "debug", "info", "warn", "error", "silent"
    logLevel: 'error',

    // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
    // on a remote machine).
    runner: 'local',

    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,

    // Override default path ('/wd/hub') for chromedriver service.
    path: '/wd/hub',

    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.

    // This defines which kind of device we want to test on, as well as how it should be configured.
    capabilities: [
        // defined in platform config files
    ],

    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    // Where the files we are testing can be found.
    specs: [path.join('test', 'ui5-app', 'webapp', 'test', 'e2e', '*.js')],

    exclude: [
        // 'path/to/excluded/files'
    ],

    // Use the Appium plugin for Webdriver. Without this, we would need to run appium
    // separately on the command line.
    services: [
        [WDI5Service]
    ],

    waitforTimeout: 60000,

    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    // The reporter is what formats your test results on the command line. 'spec' lists
    // the names of the tests with a tick or X next to them. See
    // https://www.npmjs.com/search?q=wdio-reporter for a full list of reporters.
    reporters: ['spec'],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    // wdio will run your tests using the framework below. You can choose from several,
    // much like the reporters. The full list is at https://www.npmjs.com/search?q=wdio-framework
    // https://jasmine.github.io/api/3.5/Configuration
    framework: 'mocha',
    mochaOpts: {
        timeout: 90000
    },

    wdi5: {
        screenshotPath: path.join('test','report', 'screenshots'),
        deviceType: 'native',
        logLevel: 'verbose',
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
                // path: path.join('test', 'plugins', 'custom-plugin.js')
                path: "./test/plugins/custom-plugin.js"
            }
        }
    }
};
