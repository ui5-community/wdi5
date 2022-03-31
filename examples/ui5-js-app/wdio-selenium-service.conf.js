const { join } = require("path")

exports.config = {
    wdi5: {
        screenshotPath: join("webapp", "test", "__screenshots__"),
        logLevel: "error", // error | verbose | silent
        url: "#",
        skipInjectUI5OnStart: false // default
    },
    //// wdio runner config
    specs: [join("webapp", "test", "e2e", "**/*.test.js")],
    // Patterns to exclude.
    exclude: [join("webapp", "test", "e2e", "ui5-late.test.js")],
    //// capabilities ("browser") config
    maxInstances: 10,
    capabilities: [
        {
            // overwrite global "maxInstances"
            maxInstances: 5,
            browserName: "chrome",
            acceptInsecureCerts: true,
            "goog:chromeOptions": {
                args: process.env.HEADLESS
                    ? ["window-size=1440,800", "--headless"]
                    : process.env.DEBUG
                    ? ["window-size=1440,800", "--auto-open-devtools-for-tabs"]
                    : ["window-size=1440,800"]
            }
        }
    ],
    //// test config
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: "error",
    bail: 0,
    baseUrl: "http://localhost:8888",

    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ["chromedriver", "ui5", ["selenium-standalone", { drivers: { chrome: true, chromiumedge: "latest" } }]],

    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: 60000
    },
    reporters: ["spec"]
}
