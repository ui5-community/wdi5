import { config as baseConf } from "./wdio-base.conf.js"

const _config = {
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/basic-auth/",
    capabilities: baseConf.capabilities ? [...baseConf.capabilities] : []
}

delete baseConf.capabilities

if (process.env.BROWSERSTACK) {
    _config.capabilities = _config.capabilities.map((capability) => {
        const enhancedCapability = {
            ...capability,
            "wdi5:authentication": {
                provider: "BasicAuth"
            }
        }
        return enhancedCapability
    })
} else {
    _config.capabilities = [
        {
            "wdi5:authentication": {
                provider: "BasicAuth"
            },
            browserName: "chrome",
            browserVersion: "stable",
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

export const config = { ...baseConf, ..._config }
