const { join } = require("path")

exports.config = {
    wdi5: {
        screenshotPath: join("app", "incidents", "webapp", "wdi5-test", "__screenshots__"),
        logLevel: "verbose", // error | verbose | silent
        waitForUI5Timeout: 30000
    },
    //// wdio runner config
    specs: [join("webapp", "wdi5-test", "**/*.test.js")],
    // Patterns to exclude.
    exclude: [],
    //// capabilities ("browser") config
    maxInstances: 10,
    capabilities: [
        {
            // overwrite global "maxInstances"
            maxInstances: 5,
            browserName: "chrome",
            acceptInsecureCerts: true,
            "goog:chromeOptions": {
                args:
                    process.argv.indexOf("--headless") > -1
                        ? ["window-size=1440,800", "--headless"]
                        : process.argv.indexOf("--debug") > -1
                        ? ["window-size=1920,1280", "--auto-open-devtools-for-tabs"]
                        : ["window-size=1440,800"]
            }
        }
    ],
    //// test config
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: "error",
    bail: 0,
    baseUrl: "http://localhost:8088/index.html#fe-lrop-v4",

    waitforTimeout: 20000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ["ui5"],

    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: 120000
    },
    reporters: ["spec"]
}
