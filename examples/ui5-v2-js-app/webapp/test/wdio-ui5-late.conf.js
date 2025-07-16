import { baseConfig } from "./wdio.base.conf.js"

const _config = {
    wdi5: {
        skipInjectUI5OnStart: true,
        waitForUI5Timeout: 654321
    },
    specs: ["e2e/ui5-late.test.js"],
    baseUrl: "https://github.com/ui5-community/wdi5/"
}

export const config = { ...baseConfig, ..._config }
