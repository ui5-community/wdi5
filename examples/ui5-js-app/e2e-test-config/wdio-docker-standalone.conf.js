const { baseConfig } = require("./wdio.base.conf")
const { join } = require("node:path")

// avoid multiple chrome sessions
delete baseConfig.capabilities

const _config = {
    wdi5: {
        screenshotPath: join("report", "screenshots")
    },
    baseUrl: "http://localhost:8080/index.html",
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: "chrome",
            browserVersion: "stable",
            "goog:chromeOptions": {
                args: [
                    process.env.HEADFUL === undefined ? "--headless" : "--dummy",
                    "--no-sandbox",
                    "--disable-gpu",
                    "--disable-dev-shm-usage",
                    "--window-size=1920,1080"
                ]
            }
        }
    ],
    specs: ["../webapp/test/e2e/*.test.js"]
}

exports.config = { ...baseConfig, ..._config }
