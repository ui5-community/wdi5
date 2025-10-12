import { baseConfig } from "./wdio.base.conf.js"

const _config = {
    // check that the url property still works even though it is deprecated
    wdi5: {
        url: "#"
    },
    specs: ["e2e/hash-nav.test.js"],
    baseUrl: "http://localhost:8082/index.html"
}

export const config = { ...baseConfig, ..._config }
