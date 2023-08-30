import { wdi5Config } from "wdio-ui5-service/dist/types/wdi5.types"

export const config: wdi5Config = {
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/no-auth/",
    services: ["chromedriver", "ui5"],
    specs: ["test/e2e/protocol/*.test.ts"],
    exclude: ["test/e2e/protocol/devtools-stale.test.ts"],
    capabilities: [
        {
            browserName: "chrome",
            "goog:chromeOptions": {
                args: process.argv.indexOf("--headless") > -1 ? ["headless", "disable-gpu"] : []
            },
            acceptInsecureCerts: true
        }
    ],
    waitforTimeout: 29000,
    logLevel: "error",
    reporters: ["spec"],
    framework: "mocha",
    mochaOpts: {
        timeout: 29000
    }
}
