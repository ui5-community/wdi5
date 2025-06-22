const { baseConfig } = require("./wdio.base.conf")

const _config = {
    wdi5: {
        skipInjectUI5OnStart: true,
        waitForUI5Timeout: 654321
    },
    specs: ["../webapp/test/e2e/ui5-late.test.js"],
    baseUrl: "https://github.com/ui5-community/wdi5/"
}

exports.config = { ...baseConfig, ..._config }
