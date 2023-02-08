import { config } from "./wdio-ui5.conf"

config.wdi5 = { skipInjectUI5OnStart: true }
config.specs = ["./test/e2e/ui5-late.test.ts"]
delete config.exclude
config.baseUrl = "https://github.com/ui5-community/wdi5/"

exports.config = config
