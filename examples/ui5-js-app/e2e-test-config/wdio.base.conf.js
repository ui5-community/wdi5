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
                args:
                    process.argv.indexOf("--headless") > -1
                        ? ["window-size=1440,800", "--headless"]
                        : process.argv.indexOf("--debug") > -1
                        ? ["window-size=1920,1280", "--auto-open-devtools-for-tabs"]
                        : ["window-size=1440,800"]
            }
        }
    ],
    logLevel: "error",
    bail: 0,
    baseUrl: "http://localhost:8888",

    waitforTimeout: 10000,
    connectionRetryTimeout: process.argv.indexOf("--debug") > -1 ? 1200000 : 120000,
    connectionRetryCount: 3,

    services: ["chromedriver", "ui5"],

    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: process.argv.indexOf("--debug") > -1 ? 600000 : 60000
    },
    reporters: ["spec"]
}
