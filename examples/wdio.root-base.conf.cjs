const { cpus, tmpdir } = require("node:os")
const maxInstances = Math.max(1, Math.floor(cpus().length / 2))
const isDebug = !!process.argv.includes("--debug")
const isHeadless = !!process.argv.includes("--headless")
let chromeArgs = ["window-size=1920,1280"]

if (isHeadless) {
    chromeArgs = [...chromeArgs, "headless", "disable-gpu"]
}
if (isDebug) {
    chromeArgs = [...chromeArgs, "auto-open-devtools-for-tabs", "--start-fullscreen"]
}

exports.baseConfig = {
    wdi5: {
        logLevel: "error",
        screenshotPath: tmpdir(),
        waitForUI5Timeout: 29000
    },
    maxInstances: maxInstances,
    execArgv: isDebug ? ["--inspect"] : [],
    capabilities: [
        {
            browserName: "chrome",
            // browserVersion: "stable",
            acceptInsecureCerts: true,
            // "wdio:enforceWebDriverClassic": true,
            "goog:chromeOptions": {
                args: chromeArgs
            }
        }
    ],

    // baseUrl: "" // MUST be informed
    // specs: [], // MUST be informed

    logLevel: "error",
    waitforTimeout: 30000,
    connectionRetryTimeout: isDebug ? 1200000 : 120000,
    connectionRetryCount: 3,

    services: ["ui5"],

    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: isDebug ? 600000 : 90000
    },
    reporters: ["spec"]
}
