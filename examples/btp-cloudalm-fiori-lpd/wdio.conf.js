import { cpus } from "node:os"
const maxInstances = Math.max(1, Math.floor(cpus().length / 2))
const config = {
    wdi5: {
        logLevel: "verbose",
        waitForUI5Timeout: 29000
        // skipInjectUI5OnStart: true,
    },
    waitforTimeout: 30000,

    baseUrl: "https://calm-demo.eu10.alm.cloud.sap/launchpad#Shell-home",

    services: ["ui5"],
    specs: ["./*.test.js"],
    maxInstances: maxInstances,
    capabilities: [
        {
            // TODO: Tenant access and user details - SAP Cloud ALM Cloud Demo Tenant
            // https://support.sap.com/en/alm/demo-systems/cloud-alm-demo-system.html?anchorId=section_1154284084
            "wdi5:authentication": {
                provider: "BTP" //> mandatory
                //usernameSelector: "#j_username", //> optional; default: "#j_username"
                //passwordSelector: "#j_password", //> optional; default: "#j_password"
                //submitSelector: "#logOnFormSubmit" //> optional; default: "#logOnFormSubmit"
            },
            maxInstances: maxInstances,
            browserName: "chrome",
            // browserVersion: "stable",
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
