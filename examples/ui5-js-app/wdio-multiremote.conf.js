const { baseConfig } = require("./wdio.base.conf")
const { join } = require("path")
const merge = require("deepmerge")

// avoid multiple chrome sessions
delete baseConfig.capabilities

const _config = {
    wdi5: {
        url: "#",
        screenshotPath: join("report", "screenshots")
    },
    maxInstances: 1,
    capabilities: {
        one: {
            capabilities: {
                browserName: "chrome",
                acceptInsecureCerts: true
            }
        },
        two: {
            capabilities: {
                browserName: "chrome",
                acceptInsecureCerts: true
            }
        }
    },
    specs: ["webapp/test/e2e/multiremote.test.js"]
}

exports.config = merge(baseConfig, _config)
