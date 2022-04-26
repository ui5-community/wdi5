const { join } = require("path")

const args = process.env.HEADLESS
    ? ["window-size=1440,800", "--headless"]
    : process.env.DEBUG
    ? ["window-size=1920,1280", "--auto-open-devtools-for-tabs", "--devtools"]
    : ["window-size=1440,800"]

const _baseConfig = {
    wdi5: {
        screenshotPath: join("webapp", "test", "__screenshots__"),
        logLevel: "error"
    },
    maxInstances: 10,
    capabilities: [],
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

const chrome = {
    maxInstances: 5,
    browserName: "chrome",
    acceptInsecureCerts: true,
    "goog:chromeOptions": {
        args: args
    }
}

const firefox = {
    maxInstances: 5,
    browserName: "firefox",
    "moz:firefoxOptions": {
        // flag to activate Firefox headless mode (see https://github.com/mozilla/geckodriver/blob/master/README.md#firefox-capabilities for more details about moz:firefoxOptions)
        args: args
    }
}

if (process.env.BROWSERS) {
    if (process.env.BROWSERS.includes("chrome")) {
        _baseConfig.capabilities.push(chrome)
    }
    if (process.env.BROWSERS.includes("firefox")) {
        _baseConfig.capabilities.push(firefox)
    }
} else {
    // nothing defined -> start all
    _baseConfig.capabilities.push(chrome)

    _baseConfig.capabilities.push(firefox)
}

exports.baseConfig = _baseConfig
