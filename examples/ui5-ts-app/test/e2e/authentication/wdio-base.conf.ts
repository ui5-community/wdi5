import { join } from "path"
import merge from "ts-deepmerge"
import { wdi5Config } from "wdio-ui5-service/esm/types/wdi5.types"
import { config as bstackConfig, browser } from "../cloud-services/browserstack.conf.local.js"
type _wdi5Config = Omit<wdi5Config, "capabilities">
const _config: _wdi5Config = {
    wdi5: {
        screenshotPath: join("test", "__screenshots__"),
        waitForUI5Timeout: 30000
    },
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/basic-auth/",

    // browserstack service gets injected later during merge of configs
    services: process.env.BROWSERSTACK ? [] : ["chromedriver", "ui5"],

    specs: ["./test/e2e/Basic.test.ts", "./test/e2e/Authentication.test.ts"],

    maxInstances: 10,
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

let exportedConfig
if (process.env.BROWSERSTACK) {
    // we only want a subset of browsers and OSs for testing auth
    // no need for the full scope
    const thinCapabilities = browser.filter((browser) => {
        return (
            (browser.browserName === "Chrome" &&
                browser["bstack:options"].os === "Windows" &&
                browser["bstack:options"].osVersion === "11") ||
            // (browser.browserName === "Safari" && browser["bstack:options"].os === "OS X") || //> REVISIT: our trick 17 doesn't work with Safari, ugh
            (browser.browserName === "Chrome" && browser["bstack:options"].os === "OS X") ||
            (browser.browserName === "Edge" &&
                browser["bstack:options"].os === "Windows" &&
                browser["bstack:options"].osVersion === "10")
        )
    })

    bstackConfig.capabilities = thinCapabilities
    exportedConfig = merge(_config, bstackConfig)
    exportedConfig.services = ["browserstack", "ui5"] // no need for "browserstackLocal" as we work against a deployed app
} else {
    exportedConfig = _config
}

export const config = exportedConfig
