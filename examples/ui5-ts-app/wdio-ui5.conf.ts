import type { wdi5Config } from "wdio-ui5-service"
import { join } from "node:path"
import { baseConfig } from "./wdio.base.conf.js"

export const config: wdi5Config = {
    ...baseConfig,
    wdi5: {
        screenshotPath: join("test", "__screenshots__"),
        waitForUI5Timeout: 30000
    },
    specs: ["./test/e2e/**/*.test.ts"],
    // these are for authentication tests only
    exclude: [
        "./test/e2e/Custom.test.ts",
        "./test/e2e/multiremote.test.ts",
        "./test/e2e/BasicMultiRemoteAuthentication.test.ts",
        "./test/e2e/Authentication.test.ts",
        "./test/e2e/ui5-late.test.ts",
        "./test/e2e/protocol/**/*.test.ts",
        "./test/e2e/workzone/**/*.test.ts"
    ]
}
