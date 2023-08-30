import { wdi5Config } from "wdio-ui5-service/dist/types/wdi5.types"
import { setDefaultResultOrder } from "node:dns"
export const config: wdi5Config = {
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/no-auth/",
    services: ["ui5"] /* no drivers, so wdio is falling back to devtools + puppeteer*/,
    specs: ["test/e2e/protocol/*.test.ts"],
    wdi5: {
        logLevel: "verbose"
    },
    capabilities: [
        {
            browserName: "chromium",
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
    },

    beforeSession: () => {
        setDefaultResultOrder("ipv4first")
    }
}
