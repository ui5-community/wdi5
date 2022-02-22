const { join } = require("path")

exports.config = {
    wdi5: {
        skipInjectUI5OnStart: true,
        // path: "", // commented out to use the default paths
        screenshotPath: join("webapp", "test", "__screenshots__"),
        logLevel: "verbose", // error | verbose | silent
        url: "/js-soft/wdi5/",
        deviceType: "web"
    },
    services: ["ui5", "chromedriver"],

    runner: "local",
    path: "/",

    specs: [join("webapp", "test", "e2e", "ui5-late.test.js")],

    exclude: [],

    maxInstances: 5,
    capabilities: [
        {
            browserName: "chrome",
            "goog:chromeOptions": {
                args: process.env.HEADLESS ? ["--headless"] : ["window-size=1440,800"]
            }
        }
    ],

    execArgv: [],

    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: "error",
    //
    // Set specific log levels per logger
    // use 'silent' level to disable logger
    logLevels: {
        webdriver: "silent",
        "@wdio/applitools-service": "silent"
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
    baseUrl: "https://github.com",
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
    framework: "mocha",
    mochaOpts: {
        timeout: 50000
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
    reporters: ["spec"]
}
