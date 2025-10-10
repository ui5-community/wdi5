import { wdi5Config } from "wdio-ui5-service"
import { setDefaultResultOrder } from "node:dns"
import { resolve } from "node:path"

export const config: wdi5Config = {
    baseUrl: "https://wdi5-sample-app.cfapps.eu10-004.hana.ondemand.com/no-auth/",
    services: ["ui5"],
    specs: [resolve("test/e2e/protocol/*.test.ts")],
    wdi5: {
        logLevel: "verbose",
        waitForUI5Timeout: 25000
    },
    capabilities: [
        {
            browserName: "chrome",
            "goog:chromeOptions": {
                args: process.argv.includes("--headless")
                    ? ["headless", "disable-gpu"]
                    : process.argv.includes("--debug")
                      ? ["auto-open-devtools-for-tabs"]
                      : []
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
    },

    beforeSession: () => {
        setDefaultResultOrder("ipv4first")
    }
}
