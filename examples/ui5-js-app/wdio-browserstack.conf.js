const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")

const _config = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    wdi5: {
        url: "#"
    },
    specs: [join("webapp", "test", "e2e", "**/*.test.js")],
    exclude: [join("webapp", "test", "e2e", "ui5-late.test.js")],
    waitforTimeout: 100000,
    connectionRetryTimeout: 1200000,
    connectionRetryCount: 10
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
        browserVersion: "latest",
        "bstack:options": {
            os: "Windows",
            osVersion: "11"
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
