import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    specs: [`${reusableTestScriptsPath}/basic.test.js`, `${reusableTestScriptsPath}/hash-nav.test.js`],
    // TODO: this test only works when served from the ui5-tooling server ($ ui5 serve)
    baseUrl: "http://localhost:8082/index.html?isui5toolingTest=true",
    wdi5: {
        ignoreAutoWaitUrls: [".*/Categories.*"]
    }
}
