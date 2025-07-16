const { baseConfig } = require("./wdio.base.conf")

const _config = {
    specs: ["e2e/**/*.test.js"],
    exclude: ["e2e/ui5-late.test.js", "e2e/multiremote.test.js"],
    baseUrl: "http://localhost:8081/index.html"
}

exports.config = { ...baseConfig, ..._config }
