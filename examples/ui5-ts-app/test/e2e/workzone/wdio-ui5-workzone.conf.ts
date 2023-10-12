import { wdi5Config } from "wdio-ui5-service"
import { resolve } from "path"

process.env.wdi5_username = process.env.wdi5_wz_username
process.env.wdi5_password = process.env.wdi5_wz_password

export const config: wdi5Config = {
    wdi5: {
        btpWorkZoneEnablement: true,
        logLevel: "verbose",
        waitForUI5Timeout: 25000
    },
    baseUrl: "https://cswdev.launchpad.cfapps.eu10.hana.ondemand.com/site/csw#travel-process",

    services: ["ui5"],

    specs: [resolve("./test/e2e/workzone/*.test.ts")],
    exclude: [resolve("./test/e2e/*.test.ts")],

    maxInstances: 10,
    capabilities: [
        {
            "wdi5:authentication": {
                provider: "BTP",
                disableBiometricAuthentication: true,
                idpDomain: "aqywyhweh.accounts.ondemand.com"
            },
            maxInstances: 2,
            browserName: "chrome",
            "goog:chromeOptions": {
                args:
                    process.argv.indexOf("--headless") > -1
                        ? ["--headless"]
                        : process.argv.indexOf("--debug") > -1
                        ? ["window-size=1440,800", "--auto-open-devtools-for-tabs"]
                        : ["window-size=1440,800"]
            },
            acceptInsecureCerts: true
        }
    ],
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
