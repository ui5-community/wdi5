import { wdi5Config } from "wdio-ui5-service/dist/types/wdi5.types"

export const config: wdi5Config = {
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/no-auth/",
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
