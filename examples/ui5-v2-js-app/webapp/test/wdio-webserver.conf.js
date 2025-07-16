import { baseConfig } from "./wdio.base.conf.js"

const _config = {
    specs: ["e2e/*.test.js"],
    exclude: ["e2e/ui5-late.test.js", "e2e/multiremote.test.js"],
    baseUrl: "http://localhost:8082/index.html"
}

export const config = { ...baseConfig, ..._config }
