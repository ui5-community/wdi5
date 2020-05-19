const path = require('path');
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
    // path: '/',

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
    specs: [path.join('test', 'ui5-app', 'webapp', 'test', 'e2e', '**', '*.js')],

    exclude: [
        // 'path/to/excluded/files'
    ],

    // Use the Appium plugin for Webdriver. Without this, we would need to run appium
    // separately on the command line.
    services: [
        [
            'appium',
            {
                // Appium service options here
                logPath: path.join('test', 'report', 'appium')
            }
        ]
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
        screenshotPath: path.join('test', 'report', 'screenshots'),
        deviceType: 'native',
        logLevel: 'verbose',
        capabilities: {
            rotate: true,
            camera: 2
        },
        plugins: {
            'phonegap-plugin-barcodescanner': {
                respObjIos: {
                    scanCode: '123123 - ios',
                    format: 'EAN - ios',
                    cancelled: 'some cancel stuff - ios'
                }
            }
        }
    },

    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before: function (capabilities, specs) {
        const wdi5 = require('../index');

        // todo -> move to wdi5?
        driver.setAsyncTimeout(6000);

        // call once to init
        // assume the start context is the webcontext -> "js.appiumTest"
        // first call need to be with the webcontext
        wdi5(driver, driver.getContext());

        // log the config
        wdi5()
            .getLogger()
            .log('configurations: ' + JSON.stringify(wdi5().getUtils().getConfig()));
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
        }
    }
};
