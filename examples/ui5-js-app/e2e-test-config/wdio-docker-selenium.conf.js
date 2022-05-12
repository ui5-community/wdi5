const { getBrowsers } = require("../scripts/getBrowsers")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")

const chrome = {
    maxInstances: 1,
    browserName: "chrome",
    acceptInsecureCerts: true,
    "goog:chromeOptions": {
        w3c: false,
        args: ["--headless", "--no-sandbox"]
    }
}

const firefox = {
    maxInstances: 1,
    browserName: "firefox",
    "moz:firefoxOptions": {
        // flag to activate Firefox headless mode (see https://github.com/mozilla/geckodriver/blob/master/README.md#firefox-capabilities for more details about moz:firefoxOptions)
        args: ["-headless"]
    }
}

const _config = {
    specs: ["test/e2e/basic.test.js"],
    hostname: "selenium-standalone", // tests running inside the container should connect to the same network
    port: 4444,
    runner: "local",
    path: "/wd/hub",
    maxInstances: 1,
    wdi5: {
        url: "#"
    },
    baseUrl: "http://test-app:8888"
}

config = merge(baseConfig, _config)
config.services = ["ui5"]
config.capabilities = []

const browsers = getBrowsers()

if (browsers) {
    if (browsers.includes("chrome")) {
        config.capabilities.push(chrome)
    }
    if (browsers.includes("firefox")) {
        config.capabilities.push(firefox)
    }
} else {
    // nothing defined -> start all
    config.capabilities.push(chrome)
    // firefox failing with regex test
    // config.capabilities.push(firefox)
}

exports.config = config
