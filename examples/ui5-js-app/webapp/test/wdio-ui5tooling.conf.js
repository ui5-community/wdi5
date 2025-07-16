const { baseConfig } = require("./wdio.base.conf")

const _config = {
    specs: ["e2e/basic.test.js", "e2e/hash-nav.test.js"],
    // TODO: this test only works when served from the ui5-tooling server ($ ui5 serve)
    baseUrl: "http://localhost:8081/index.html?isui5toolingTest=true",
    wdi5: {
        ignoreAutoWaitUrls: [".*/Categories.*"]
    }
}

exports.config = { ...baseConfig, ..._config }
