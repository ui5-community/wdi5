const { join } = require("node:path")
const { baseConfig } = require("../wdio.root-base.conf.cjs")

exports.config = {
    ...baseConfig,
    wdi5: {
        screenshotPath: join("app", "incidents", "webapp", "test", "e2e", "__screenshots__"),
        logLevel: "verbose", // error | verbose | silent
        waitForUI5Timeout: 30000
    },
    specs: ["webapp/test/**/*.test.js"],
    baseUrl: "http://localhost:8088/index.html"
}
