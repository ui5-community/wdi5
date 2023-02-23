import { wdi5Config } from "wdio-ui5-service/dist/types/wdi5.types"

export const config: wdi5Config = {
    baseUrl: "https://cswdev.launchpad.cfapps.eu10.hana.ondemand.com/site/csw#TestSampleTSapp-display",
    services: ["ui5"] /* no drivers, so wdio is falling back to devtools*/,
    specs: ["test/e2e/Protocol.test.ts"],
    capabilities: [
        {
            browserName: "chrome"
        }
    ],
    waitforTimeout: 20000,
    logLevel: "debug",
    reporters: ["spec"],
    framework: "mocha",
    mochaOpts: {
        timeout: 20000
    }
}
