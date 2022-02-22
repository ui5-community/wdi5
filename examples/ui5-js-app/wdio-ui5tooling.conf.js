const { join } = require("path")

exports.config = {
    wdi5: {
        screenshotPath: join("webapp", "test", "__screenshots__"),
        logLevel: "error", // error | verbose | silent
        url: "index.html",
        skipInjectUI5OnStart: false // default
    },
    //// wdio runner config
    specs: ["./webapp/test/e2e/basic.test.js"],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //// capabilities ("browser") config
    maxInstances: 10,
    capabilities: [
        {
            // overwrite global "maxInstances"
            maxInstances: 5,
            browserName: "chrome",
            acceptInsecureCerts: true,
            "goog:chromeOptions": {
                args: process.env.HEADLESS ? ["--headless"] : ["window-size=1440,800"]
            }
        }
    ],
    //// test config
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: "error",
    bail: 0,
    baseUrl: "http://localhost:8080",

    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ["chromedriver", "ui5"],

    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: 60000
    },
    reporters: ["spec"]
}
