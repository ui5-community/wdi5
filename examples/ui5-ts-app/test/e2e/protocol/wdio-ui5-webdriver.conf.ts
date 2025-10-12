import { wdi5Config } from "wdio-ui5-service"
import { setDefaultResultOrder } from "node:dns"
import { resolve } from "node:path"

export const config: wdi5Config = {
    baseUrl: "https://wdi5-sample-app.cfapps.eu10-004.hana.ondemand.com/no-auth/",
    services: ["ui5"],
    wdi5: {
        logLevel: "verbose",
        waitForUI5Timeout: 25000
    },
    specs: [resolve("test/e2e/protocol/*.test.ts")],
    capabilities: [
        {
            browserName: "chrome",
            "wdio:enforceWebDriverClassic": true,
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
        timeout: process.env.DEBUG ? 290000 : 29000
    },
    beforeSession: () => {
        setDefaultResultOrder("ipv4first")
    }
}
