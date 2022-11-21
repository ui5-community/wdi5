const { baseConfig } = require("./wdio.base.conf")
const { join } = require("path")
const merge = require("deepmerge")

// avoid multiple chrome sessions
delete baseConfig.capabilities

const _config = {
    wdi5: {
        screenshotPath: join("report", "screenshots")
    },
    maxInstances: 1,
    capabilities: {
        one: {
            capabilities: {
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
        },
        two: {
            capabilities: {
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
        }
    },
    specs: ["webapp/test/e2e/multiremote.test.js"]
}

exports.config = merge(baseConfig, _config)
