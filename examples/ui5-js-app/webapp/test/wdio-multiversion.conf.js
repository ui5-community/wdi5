const { baseConfig } = require("./wdio.base.conf")

const _config = {
    specs: ["e2e/basic.test.js", "e2e/hash-nav.test.js", "e2e/properties-matcher.test.js"],
    baseUrl: "http://localhost:8081/index.html"
}

exports.config = { ...baseConfig, ..._config }
