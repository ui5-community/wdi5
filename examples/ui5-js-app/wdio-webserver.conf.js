const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")
const { wdi5 } = require("wdio-ui5-service")
const { getBrowsers } = require("./scripts/getBrowsers")

const chrome = {
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
const _browsers = getBrowsers()

if (_browsers && _browsers.length > 0) {
    wdi5.getLogger().log(`requested browsers: ${_browsers}`)

    if (_browsers.includes("chrome")) {
        _config.capabilities.push(chrome)
    }
    if (_browsers.includes("firefox")) {
        _config.capabilities.push(firefox)
    }
} else {
    _config.capabilities.push(chrome)
    // firefox not working with regex tests
    // _config.capabilities.push(firefox)
}

exports.config = merge(baseConfig, _config)
