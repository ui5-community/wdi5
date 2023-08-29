import { config as baseConfig } from "./wdio-ui5.conf.js"

baseConfig.wdi5 = { skipInjectUI5OnStart: true }
baseConfig.specs = ["./test/e2e/ui5-late.test.ts"]
delete baseConfig.exclude
baseConfig.baseUrl = "https://github.com/ui5-community/wdi5/"

export const config = { ...baseConfig }
