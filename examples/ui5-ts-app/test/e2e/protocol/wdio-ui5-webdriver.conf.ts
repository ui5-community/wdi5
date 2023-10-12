import { wdi5Config } from "wdio-ui5-service"
import { resolve } from "path"

export const config: wdi5Config = {
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/no-auth/",
    services: ["ui5"],
    wdi5: {
        logLevel: "verbose",
        waitForUI5Timeout: 25000
    },
    specs: [resolve("test/e2e/protocol/*.test.ts")],
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
