import { config as baseConf } from "./wdio-base.conf.js"

const _config = {
    baseUrl: "https://wdi5-sample-app.cfapps.eu10-004.hana.ondemand.com/xsuaa/",
    capabilities: baseConf.capabilities ? [...baseConf.capabilities] : []
}

delete baseConf.capabilities

if (process.env.BROWSERSTACK) {
    _config.capabilities = _config.capabilities.map((capability) => {
        const enhancedCapability = {
            ...capability,
            "wdi5:authentication": {
                provider: "BTP",
                idpDomain: "aumjbebdf.accounts.ondemand.com"
            }
        }
        return enhancedCapability
    })
} else {
    _config.capabilities = [
        {
            "wdi5:authentication": {
                provider: "BTP"
            },
            browserName: "chrome",
            // browserVersion: "stable",
            "goog:chromeOptions": {
                args: process.argv.includes("--headless")
                    ? ["headless", "disable-gpu"]
                    : process.argv.includes("--debug")
                      ? ["window-size=1440,800", "auto-open-devtools-for-tabs"]
                      : ["window-size=1440,800"]
            },
            acceptInsecureCerts: true
        }
    ]
}

export const config = { ...baseConf, ..._config }
