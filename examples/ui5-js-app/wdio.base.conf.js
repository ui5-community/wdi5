const { join } = require("path")

exports.baseConfig = {
    wdi5: {
        screenshotPath: join("webapp", "test", "__screenshots__"),
        logLevel: "error"
    },
    maxInstances: 10,
    capabilities: [
        {
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
    logLevel: "error",
    bail: 0,
    baseUrl: "http://localhost:8888",

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
