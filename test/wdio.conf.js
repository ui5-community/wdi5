exports.config = {
    // ==================================
    // Where should your test be launched
    // ==================================
    //
    runner: 'local',
    //
    // =====================
    // Server Configurations
    // =====================
    // Host address of the running Selenium server. This information is usually obsolete, as
    // WebdriverIO automatically connects to localhost. Also if you are using one of the
    // supported cloud services like Sauce Labs, Browserstack, Testing Bot or LambdaTest, you also don't
    // need to define host and port information (because WebdriverIO can figure that out
    // from your user and key information). However, if you are using a private Selenium
    // backend, you should define the `hostname`, `port`, and `path` here.
    //
    // Override default path ('/wd/hub') for chromedriver service.
    path: '/',
    // hostname: 'localhost',
    // port: 4444,
    // Protocol: http | https
    // protocol: 'http',
    //
    // =================
    // Service Providers
    // =================
    // WebdriverIO supports Sauce Labs, Browserstack, Testing Bot and LambdaTest. (Other cloud providers
    // should work, too.) These services define specific `user` and `key` (or access key)
    // values you must put here, in order to connect to these services.
    //
    //
    // If you run your tests on SauceLabs you can specify the region you want to run your tests
    // in via the `region` property. Available short handles for regions are `us` (default) and `eu`.
    // These regions are used for the Sauce Labs VM cloud and the Sauce Labs Real Device Cloud.
    // If you don't provide the region, it defaults to `us`.
    // region: 'us',
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called.
    //
    // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
    // then the current working directory is where your `package.json` resides, so `wdio`
    // will be called from there.
    //
    specs: ['./test/ui5-app/webapp/test/e2e/**/*.js'],
    // Patterns to exclude.
    exclude: [],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your `capabilities`, you can overwrite the `spec` and `exclude`
    // options in order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set `maxInstances` to 1. wdio will spawn 3 processes.
    //
    // Therefore, if you have 10 spec files and you set `maxInstances` to 10, all spec files
    // will be tested at the same time and 30 processes will be spawned.
    //
    // The property basically handles how many capabilities from the same test should run tests.
    //
    maxInstances: 1,
    //
    // Or set a limit to run tests with a specific capability.
    maxInstancesPerCapability: 5,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    //
    capabilities: [
        {
            // maxInstances can get overwritten per capability. So if you have an in-house Selenium
            // grid with only 5 firefox instances available you can make sure that not more than
            // 5 instances get started at a time.
            maxInstances: 1,
            browserName: 'chrome'
        }
    ],

    wdi5: {
        // path: "", // commented out to use the default paths
        screenshotPath: './test/report/screenshots',
        logLevel: 'error', // error | verbose | silent
        deviceType: 'web',
        capabilities: {
            // test
            rotate: true,
            camera: 2
        }
    },

    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    // Use the Appium plugin for Webdriver. Without this, we would need to run appium
    // separately on the command line.
    services: ['chromedriver'], // cannot beeing started standalone // ./node_modules/chromedriver80/bin/chromedriver"
    //
    // Additional list of node arguments to use when starting child processes
    execArgv: [],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'error',
    //
    // Set specific log levels per logger
    // use 'silent' level to disable logger
    logLevels: {
        webdriver: 'silent',
        '@wdio/applitools-service': 'silent'
    },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten `url()` command calls. If your `url` parameter starts
    // with `/`, the `baseUrl` is prepended, not including the path portion of `baseUrl`.
    //
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the `baseUrl`
    // gets prepended directly.
    baseUrl: 'http://localhost:8888/',
    //
    // Default timeout for all waitForUI5 commands. This is the timeout used for the `executeAsync`funciton
    waitforTimeout: 10000,
    //
    // Add files to watch (e.g. application code or page objects) when running `wdio` command
    // with `--watch` flag. Globbing is supported.
    filesToWatch: [
        // e.g. rerun tests if I change my application code
        // './app/**/*.js'
    ],
    //
    // Framework you want to run your specs with.
    // The following are supported: 'mocha', 'jasmine', and 'cucumber'
    // See also: https://webdriver.io/docs/frameworks.html
    //
    // Make sure you have the wdio adapter package for the specific framework installed before running any tests.
    framework: 'mocha',
    mochaOpts: {
        timeout: 30000
    },
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 60000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // See also: https://webdriver.io/docs/dot-reporter.html , and click on "Reporters" in left column
    reporters: ['spec'],

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides a several hooks you can use to interfere the test process in order to enhance
    // it and build services around it. You can either apply a single function to it or an array of
    // methods. If one of them returns with a promise, WebdriverIO will wait until that promise is
    // resolved to continue.
    //
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before: function (capabilities, specs) {
        // load module
        const wdi5 = require('../index');
        // create instance without param -> for browser
        wdi5();

        // can this be done in config?
        browser.url('index.html');

        // then use the get* Calls
        wdi5()
            .getLogger()
            .log('configurations: ' + JSON.stringify(wdi5().getUtils().getConfig()));

        // UI5 bridge setup
        wdi5().getWDioUi5().setup(browser); // use wdio hooks for setting up wdio<->ui5 bridge
        wdi5().getWDioUi5().injectUI5(browser); // needed to let the instance know that UI5 is now available for work
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
