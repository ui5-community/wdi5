import { join } from "node:path"
const { cpus } = require("node:os")
const maxInstances = Math.max(1, Math.floor(cpus().length / 2))

const baseConfig = {
    wdi5: {
        screenshotPath: join("webapp", "test", "__screenshots__"),
        logLevel: "error",
        waitForUI5Timeout: 29000
    },
    maxInstances: maxInstances,
    capabilities: [
        {
            maxInstances: maxInstances,
            browserName: "chrome",
            // browserVersion: "stable",
            acceptInsecureCerts: true,
            // "wdio:enforceWebDriverClassic": true,
            "goog:chromeOptions": {
                args: process.argv.includes("--headless")
                    ? ["window-size=1920,1280", "headless", "disable-gpu"]
                    : process.argv.includes("--debug")
                      ? ["window-size=1920,1280", "auto-open-devtools-for-tabs"]
                      : ["window-size=1920,1280"]
            }
        }
    ],
    logLevel: "error",
    bail: 0,
    baseUrl: "http://localhost:8082/index.html",

    waitforTimeout: 30000,
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

export { baseConfig }
