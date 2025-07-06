const { baseConfig } = require("./wdio.base.conf")

const _config = {
    specs: ["../webapp/test/e2e/**/*.test.js"],
    exclude: ["../webapp/test/e2e/ui5-late.test.js", "../webapp/test/e2e/multiremote.test.js"],
    baseUrl: "http://localhost:8888"
}

exports.config = { ...baseConfig, ..._config }
