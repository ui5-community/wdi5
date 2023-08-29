import { wdi5Config } from "wdio-ui5-service"
import { setDefaultResultOrder } from "node:dns"
import { resolve } from "path"

export const config: wdi5Config = {
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/no-auth/",
    services: ["ui5"],
    specs: [resolve("test/e2e/Protocol.test.ts")],
    automationProtocol: "devtools",
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
    },

    beforeSession: () => {
        setDefaultResultOrder("ipv4first")
    }
}
