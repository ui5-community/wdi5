import type { wdi5Config } from "wdio-ui5-service"
import { baseConfig } from "./wdio.base.conf.js"

export const config: wdi5Config = {
    ...baseConfig,
    wdi5: {
        skipInjectUI5OnStart: true,
        waitForUI5Timeout: 654321
    },
    specs: ["./test/e2e/ui5-late.test.ts"],
    baseUrl: "https://github.com/ui5-community/wdi5/"
}
