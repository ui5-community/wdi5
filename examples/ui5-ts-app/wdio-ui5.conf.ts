import { join } from "path"
import { wdi5Config } from "wdio-ui5-service/dist/types/wdi5.types"

export const config: wdi5Config = {
    wdi5: {
        screenshotPath: join("test", "__screenshots__"),
        url: "index.html"
    },
    baseUrl: "http://localhost:8080/",

    services: ["chromedriver", "ui5"],

    specs: ["./test/e2e/**/*.test.ts"],

    maxInstances: 10,
    capabilities: [
        {
            maxInstances: 5,
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
