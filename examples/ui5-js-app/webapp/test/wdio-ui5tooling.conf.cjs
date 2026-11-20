const { baseConfig, reusableTestScriptsPath } = require("./wdio.base.conf.cjs")

exports.config = {
    ...baseConfig,
    specs: [`${reusableTestScriptsPath}/basic.test.cjs`, `${reusableTestScriptsPath}/hash-nav.test.cjs`],
    // TODO: this test only works when served from the ui5-tooling server ($ ui5 serve)
    baseUrl: "http://localhost:8081/index.html?isui5toolingTest=true",
    wdi5: {
        ignoreAutoWaitUrls: [".*/Categories.*"]
    }
}
