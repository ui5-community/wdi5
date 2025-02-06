import { resolve } from "path"
import { merge } from "ts-deepmerge"
import { config as baseConf } from "./wdio-base.conf.js"
import "dotenv/config"

const _config = {
    baseUrl: "https://emea.cockpit.btp.cloud.sap/cockpit",
    capabilities: baseConf.capabilities ? [...baseConf.capabilities] : []
}

delete baseConf.capabilities
delete baseConf.specs

baseConf.specs = [resolve("./test/e2e/AuthenticationCert.test.ts")]

if (process.env.BROWSERSTACK) {
    _config.capabilities = _config.capabilities.map((capability) => {
        const enhancedCapability = {
            ...capability,
            "wdi5:authentication": {
                provider: "Certificate",
                certificateOrigin: "https://accounts.sap.com",
                certificateUrl: "https://emea.cockpit.btp.cloud.sap/cockpit#/",
                certificatePfxPath: "./sap.pfx",
                certificatePfxPassword: process.env.SAPPFX_PASSPHRASE
            }
        }
        return enhancedCapability
    })
} else {
    _config.capabilities = [
        {
            "wdi5:authentication": {
                provider: "Certificate",
                certificateOrigin: "https://accounts.sap.com",
                certificateUrl: "https://emea.cockpit.btp.cloud.sap/cockpit#/",
                certificatePfxPath: "./sap.pfx",
                certificatePfxPassword: process.env.SAPPFX_PASSPHRASE
            },
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

export const config = merge(baseConf, _config)
