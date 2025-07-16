import { join } from "node:path"
import { wdi5Config } from "wdio-ui5-service"

export const config: wdi5Config = {
    wdi5: {
        screenshotPath: join("test", "__screenshots__"),
        waitForUI5Timeout: 30000
    },
    baseUrl: "http://localhost:8080/index.html",

    services: ["ui5"],

    specs: ["./test/e2e/**/*.test.ts"],
    // these are for authentication tests only
    exclude: [
        "./test/e2e/Custom.test.ts",
        "./test/e2e/multiremote.test.ts",
        "./test/e2e/BasicMultiRemoteAuthentication.test.ts",
        "./test/e2e/Authentication.test.ts",
        "./test/e2e/ui5-late.test.ts",
        "./test/e2e/protocol/**/*.test.ts",
        "./test/e2e/workzone/**/*.test.ts"
    ],

    maxInstances: 10,
    capabilities: [
        {
            maxInstances: 2,
            browserName: "chrome",
            browserVersion: "stable",
            "goog:chromeOptions": {
                args: process.argv.includes("--headless")
                    ? ["headless", "disable-gpu"]
                    : process.argv.includes("--debug")
                      ? ["window-size=1440,800", "auto-open-devtools-for-tabs"]
                      : ["window-size=1440,800"]
            },
            acceptInsecureCerts: true
        }
    ],
    logLevel: "error",
    bail: 0,

    waitforTimeout: 10000,
    connectionRetryTimeout: process.argv.includes("--debug") ? 1200000 : 120000,
    connectionRetryCount: 3,

    reporters: ["spec"],

    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: process.argv.includes("--debug") ? 600000 : 60000
    }
}
