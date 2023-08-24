import merge from "ts-deepmerge"
import { config as baseConf } from "./wdio-base.conf.js"

// hack-y in these public (!) credentials
process.env.wdi5_username = "tomsmith"
process.env.wdi5_password = "SuperSecretPassword!"

const authBlock = {
    provider: "custom",
    usernameSelector: "input[id='username']",
    passwordSelector: "input[id='password']",
    submitSelector: "button[type='submit']"
}

const _config = {
    baseUrl: "https://the-internet.herokuapp.com/login",
    capabilities: baseConf.capabilities ? [...baseConf.capabilities] : [],
    wdi5: {
        skipInjectUI5OnStart: true
    }
}

delete baseConf.capabilities

if (process.env.BROWSERSTACK) {
    _config.capabilities = _config.capabilities.map((capability) => {
        const enhancedCapability = {
            ...capability,
            "wdi5:authentication": authBlock
        }
        return enhancedCapability
    })
} else {
    _config.capabilities = [
        {
            "wdi5:authentication": authBlock,
            browserName: "chrome",
            "goog:chromeOptions": {
                args:
                    process.argv.indexOf("--headless") > -1
                        ? ["headless", "disable-gpu"]
                        : process.argv.indexOf("--debug") > -1
                        ? ["window-size=1440,800", "--auto-open-devtools-for-tabs"]
                        : ["window-size=1440,800"]
            },
            acceptInsecureCerts: true
        }
    ]
}

const config = merge(baseConf, _config)
config.specs = ["./test/e2e/Custom.test.ts"]
export { config }
