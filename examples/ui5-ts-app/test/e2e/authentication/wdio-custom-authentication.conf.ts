import { join } from "path"
import { wdi5Config } from "wdio-ui5-service/dist/types/wdi5.types"
process.env.wdi5_username = "tomsmith"
process.env.wdi5_password = "SuperSecretPassword!"
export const config: wdi5Config = {
    wdi5: {
        screenshotPath: join("test", "__screenshots__"),
        url: "",
        waitForUI5Timeout: 30000
    },
    baseUrl: "https://the-internet.herokuapp.com/login",

    services: ["chromedriver", "ui5"],

    specs: ["./test/e2e/**/Custom.test.ts"],

    maxInstances: 10,
    capabilities: [
        {
            "wdi5:authentication": {
                provider: "custom",
                usernameSelector: "input[id='username']",
                passwordSelector: "input[id='password']",
                submitSelector: "button[type='submit']"
            },
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