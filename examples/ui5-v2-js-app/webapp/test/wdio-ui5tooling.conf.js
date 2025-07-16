import { baseConfig } from "./wdio.base.conf.js"

const _config = {
    specs: ["e2e/basic.test.js", "e2e/hash-nav.test.js"],
    baseUrl: "http://localhost:8082/index.html?isui5toolingTest=true",
    wdi5: {
        ignoreAutoWaitUrls: [".*/Categories.*"]
    }
}

export const config = { ...baseConfig, ..._config }
