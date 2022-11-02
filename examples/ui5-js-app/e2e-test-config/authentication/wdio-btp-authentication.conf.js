const { join } = require("path")
const { baseConfig } = require("../wdio.base.conf")
const merge = require("deepmerge")

const _config = {
    wdi5: {
        url: "#"
    },
    specs: [join("webapp", "test", "e2e", "**/basic.test.js")],
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/xsuaa/"
}
// we need to overwrite and not merge it
baseConfig.capabilities = [
    {
        "wdi5:authentication": {
            provider: "BTP"
        },
        maxInstances: 4,
        browserName: "chrome",
        acceptInsecureCerts: true,
        "goog:chromeOptions": {
            args:
                process.argv.indexOf("--headless") > -1
                    ? ["window-size=1920,1280", "--headless"]
                    : process.argv.indexOf("--debug") > -1
                    ? ["window-size=1920,1280", "--auto-open-devtools-for-tabs"]
                    : ["window-size=1920,1280"]
        }
    }
]

exports.config = merge(baseConfig, _config)
