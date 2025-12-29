import { cpus } from "node:os"
const maxInstances = Math.max(1, Math.floor(cpus().length / 2))
const config = {
    wdi5: {
        logLevel: "verbose",
        waitForUI5Timeout: 29000,
        btpWorkZoneEnablement: true
        // skipInjectUI5OnStart: true,
    },
    waitforTimeout: 30000,

    // TODO: Set baseUrl to your BTP WorkZone Standard tenant URL
    baseUrl: "THIS_MUST_BE_YOUR_BTP_WORKZONE_STD_TENANT_URL",

    services: ["ui5"],
    specs: ["./*.test.js"],
    maxInstances: maxInstances,
    capabilities: [
        {
            /* "wdi5:authentication": {
                provider: "BTP" //> mandatory
            }, */
            maxInstances: maxInstances,
            browserName: "chrome",
            browserVersion: "stable",
            "goog:chromeOptions": {
                args: process.argv.includes("--headless")
                    ? ["window-size=1440,800", "headless", "disable-gpu"]
                    : ["window-size=1440,800"]
            }
        }
    ],
    logLevel: "error",

    reporters: ["spec"],

    framework: "mocha",

    mochaOpts: {
        ui: "bdd",
        timeout: 60000
    }
}

export { config }
