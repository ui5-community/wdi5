import { join } from "path"
import { wdi5Config } from "wdio-ui5-service/dist/types/wdi5.types"

type _wdi5Config = Omit<wdi5Config, "capabilities">
export const config: _wdi5Config = {
    wdi5: {
        screenshotPath: join("test", "__screenshots__"),
        url: "#",
        waitForUI5Timeout: 30000
    },
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/basic-auth/",

    services: ["chromedriver", "ui5"],

    specs: ["./test/e2e/Basic.test.ts"],

    maxInstances: 10,
    logLevel: "error",
    bail: 0,

    waitforTimeout: 10000,
    connectionRetryTimeout: process.argv.indexOf("--debug") > -1 ? 1200000 : 120000,
    connectionRetryCount: 3,

    reporters: ["spec"],

    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: process.argv.indexOf("--debug") > -1 ? 600000 : 60000
    }
}
