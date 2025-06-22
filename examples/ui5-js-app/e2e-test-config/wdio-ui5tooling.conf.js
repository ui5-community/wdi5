const { baseConfig } = require("./wdio.base.conf")

const _config = {
    specs: ["../webapp/test/e2e/basic.test.js", "../webapp/test/e2e/hash-nav.test.js"],
    // TODO: this test only works when served from the ui5-tooling server ($ ui5 serve)
    baseUrl: "http://localhost:8080/index.html?isui5toolingTest=true",
    wdi5: {
        ignoreAutoWaitUrls: [".*/Categories.*"]
    }
}

exports.config = { ...baseConfig, ..._config }
