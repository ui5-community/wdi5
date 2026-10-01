import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    specs: [`${reusableTestScriptsPath}/basic.test.ts`, `${reusableTestScriptsPath}/hash-nav.test.ts`],
    // TODO: this test only works when served from the ui5-tooling server ($ ui5 serve)
    baseUrl: "http://localhost:8083/index.html?isui5toolingTest=true",
    wdi5: {
        ignoreAutoWaitUrls: [".*/Categories.*"]
    }
}
