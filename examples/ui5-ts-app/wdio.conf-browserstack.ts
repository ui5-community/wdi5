import { join } from "path"
import * as dotenv from "dotenv"
dotenv.config()
import { wdi5Config } from "wdio-ui5-service/dist/types/wdi5.types"

export const config: wdi5Config = {
    wdi5: {
        screenshotPath: "__screenshots__",
        waitForUI5Timeout: 30000 // [optional] {number}, default: 15000; maximum waiting time in milliseconds while checking for UI5 availability
    },
    baseUrl: "http://localhost:8080/index.html",

    services: [["browserstack", { browserstackLocal: true }], "ui5"],

    specs: ["./test/e2e/**/*.test.ts"],
    // these are for authentication tests only
    exclude: [
        "./test/e2e/Custom.test.ts",
        "./test/e2e/multiremote.test.ts",
        "./test/e2e/BasicMultiRemoteAuthentication.test.ts",
        "./test/e2e/Authentication.test.ts"
    ],

    maxInstances: 3,
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,

    capabilities: [
        {
            browserName: "Edge",
            browserVersion: "latest",
            "bstack:options": {
                os: "Windows",
                osVersion: "11"
            }
        },
        {
            browserName: "Opera",
            "bstack:options": {
                os: "Windows",
                osVersion: "XP",
                browserVersion: "12.16",
                local: "true"
            }
        }
    ],
    logLevel: "error",
    bail: 0,

    waitforTimeout: 30000,
    connectionRetryTimeout: process.argv.indexOf("--debug") > -1 ? 1200000 : 120000,
    connectionRetryCount: 3,

    reporters: ["spec"],

    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: process.argv.indexOf("--debug") > -1 ? 600000 : 60000
    }
}
