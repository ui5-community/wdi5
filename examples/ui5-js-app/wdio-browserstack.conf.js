const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")

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
conf.capabilities = [
    {
        browserName: "Chrome",
        browserVersion: "latest",
        "bstack:options": {
            os: "OS X",
            osVersion: "Monterey"
        }
    },
    {
        browserName: "Firefox",
        browserVersion: "98.0",
        "bstack:options": {
            os: "Windows",
            osVersion: "11",
            local: true,
            networkLogs: true,
            seleniumVersion: "3.10.0",
            video: false
        }
    },
    {
        browserName: "Safari",
        browserVersion: "latest",
        "bstack:options": {
            os: "OS X",
            osVersion: "Monterey"
        }
    },
    {
        browserName: "Edge",
        browserVersion: "latest",
        "bstack:options": {
            os: "Windows",
            osVersion: "11"
        }
    }
]

exports.config = conf
