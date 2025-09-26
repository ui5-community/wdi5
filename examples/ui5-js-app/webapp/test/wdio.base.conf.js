const { join } = require("node:path")

exports.baseConfig = {
    wdi5: {
        screenshotPath: join("webapp", "test", "__screenshots__"),
        logLevel: "error",
        waitForUI5Timeout: 29000
    },
    maxInstances: 10,
    capabilities: [
        {
            maxInstances: 4,
            browserName: "chrome",
            // browserVersion: "stable",
            acceptInsecureCerts: true,
            // "wdio:enforceWebDriverClassic": true,
            "goog:chromeOptions": {
                args: process.argv.includes("--headless")
                    ? ["window-size=1920,1280", "headless", "disable-gpu"]
                    : process.argv.includes("--debug")
                      ? ["window-size=1920,1280", "auto-open-devtools-for-tabs", "--start-fullscreen"]
                      : ["window-size=1920,1280"]
            }
        }
    ],
    logLevel: "error",
    bail: 0,
    baseUrl: "http://localhost:8081/index.html",

    waitforTimeout: 20000,
    connectionRetryTimeout: process.argv.includes("--debug") ? 1200000 : 120000,
    connectionRetryCount: 3,

    services: ["ui5"],

    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: process.argv.includes("--debug") ? 600000 : 90000
    },
    reporters: ["spec"]
}
