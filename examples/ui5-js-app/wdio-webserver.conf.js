const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")

const chrome = {
    maxInstances: 5,
    browserName: "chrome",
    acceptInsecureCerts: true,
    "goog:chromeOptions": {
        args: process.env.HEADLESS
            ? ["window-size=1440,800", "--headless"]
            : process.env.DEBUG
            ? ["window-size=1920,1280", "--auto-open-devtools-for-tabs"]
            : ["window-size=1440,800"]
    }
}

const firefox = {
    maxInstances: 1,
    browserName: "firefox",
    "moz:firefoxOptions": {
        // flag to activate Firefox headless mode (see https://github.com/mozilla/geckodriver/blob/master/README.md#firefox-capabilities for more details about moz:firefoxOptions)
        args: ["-jsdebugger", "devtools.chrome.enabled", "devtools.debugger.prompt-connection", "--jsdebugger"]
    }
}

const _config = {
    wdi5: {
        url: "#"
    },
    capabilities: [],
    specs: [join("webapp", "test", "e2e", "**/*.test.js")],
    exclude: [join("webapp", "test", "e2e", "ui5-late.test.js")],
    baseUrl: "http://localhost:8888"
}

// add browsers
baseConfig.capabilities = []
const _browsers = process.env.BROWSERS
if (_browsers && _browsers.length > 0) {
    console.log(`requested browsers: ${_browsers}`)
    if (_browsers.includes("chrome")) {
        _config.capabilities.push(chrome)
    }
    if (_browsers.includes("firefox")) {
        _config.capabilities.push(firefox)
    }
} else {
    _config.capabilities.push(chrome)
    _config.capabilities.push(firefox)
}

exports.config = merge(baseConfig, _config)
