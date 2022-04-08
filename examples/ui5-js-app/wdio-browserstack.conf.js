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
    exclude: [join("webapp", "test", "e2e", "ui5-late.test.js")]
}

let conf = merge(baseConfig, _config)

// override, not merge
conf.services = [["browserstack", { browserstackLocal: true }], "ui5"]
conf.capabilities = [
    {
        browserName: "chrome",
        platformName: "MAC"
    },
    {
        browserName: "firefox",
        platformName: "WINDOWS"
    },
    {
        browserName: "safari",
        platformName: "MAC"
    },
    {
        browserName: "edge",
        platformName: "WINDOWS"
    }
]

exports.config = conf
