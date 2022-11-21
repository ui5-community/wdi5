import { config as baseConf } from "./wdio-base.conf"
import { wdi5Capabilites } from "wdio-ui5-service/dist/types/wdi5.types"
import merge from "ts-deepmerge"

// hack-y in these public (!) credentials
process.env.wdi5_username = "tomsmith"
process.env.wdi5_password = "SuperSecretPassword!"

const capability: wdi5Capabilites = {
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
const _config = {
    // we silently acknowledge that this is not a UI5 app
    // being tested, so browser-scoped errors are ok
    baseUrl: "https://the-internet.herokuapp.com/login",
    capabilities: [capability],
    wdi5: {
        skipInjectUI5OnStart: true
    }
}
const config = merge(baseConf, _config)
config.specs = ["./test/e2e/Custom.test.ts"]
export { config }
