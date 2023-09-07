import { join } from "path"
import { wdi5Config } from "wdio-ui5-service"

export const config: wdi5Config = {
    wdi5: {
        screenshotPath: join("test", "__screenshots__")
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
