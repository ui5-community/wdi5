const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")
const { wdi5 } = require("wdio-ui5-service")

const _config = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    wdi5: {
        url: "#",
        waitForUI5Timeout: 1200000
    },
    specs: [join("webapp", "test", "e2e", "**/*.test.js")],
    exclude: [join("webapp", "test", "e2e", "ui5-late.test.js")],
    waitforTimeout: 100000,
    connectionRetryTimeout: 1200000,
    connectionRetryCount: 10,
    mochaOpts: {
        timeout: 120000
    }
}

let conf = merge(baseConfig, _config)

// override, not merge
conf.services = [["browserstack", { browserstackLocal: true }], "ui5"]

// browsers
const chrome = {
    browserName: "Chrome",
    browserVersion: "latest",
    "bstack:options": {
        os: "OS X",
        osVersion: "Monterey"
    }
}
const firefox = {
    browserName: "Firefox",
    browserVersion: "98.0",
    "bstack:options": {
        os: "Windows",
        osVersion: "11"
    }
}
const safari = {
    browserName: "Safari",
    browserVersion: "latest",
    "bstack:options": {
        os: "OS X",
        osVersion: "Monterey"
    }
}
const edge = {
    browserName: "Edge",
    browserVersion: "latest",
    "bstack:options": {
        os: "Windows",
        osVersion: "11"
    }
}

// add browsers
conf.capabilities = []
const _browsers = process.env.BROWSERS
if (_browsers && _browsers.length > 0) {
    wdi5.getLogger().log(`requested browsers: ${_browsers}`)

    if (_browsers.includes("chrome")) {
        conf.capabilities.push(chrome)
    }
    if (_browsers.includes("safari")) {
        conf.capabilities.push(safari)
    }
    if (_browsers.includes("firefox")) {
        conf.capabilities.push(firefox)
    }
    if (_browsers.includes("edge")) {
        conf.capabilities.push(edge)
    }
} else {
    conf.capabilities.push(chrome)
    conf.capabilities.push(safari)
    // firefox not working with regex tests
    // conf.capabilities.push(firefox)
    conf.capabilities.push(edge)
}

exports.config = conf
