import merge from "ts-deepmerge"
import { wdi5MultiRemoteCapability } from "wdio-ui5-service"
import { config as baseConf } from "./wdio-base.conf.js"
import { browser } from "../cloud-services/browserstack.conf.local.js"
import { resolve } from "path"

let multiRemoteCapability: wdi5MultiRemoteCapability

if (process.env.BROWSERSTACK) {
    multiRemoteCapability = {
        one: {
            capabilities: {
                "wdi5:authentication": {
                    provider: "BTP"
                },
                ...browser[0] // Edge - Win 11
            }
        },
        two: {
            capabilities: {
                "wdi5:authentication": {
                    provider: "BTP"
                },
                ...browser[6] // Chrome - macOS
            }
        }
    }
} else {
    multiRemoteCapability = {
        one: {
            capabilities: {
                "wdi5:authentication": {
                    provider: "BTP"
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
        },
        two: {
            capabilities: {
                "wdi5:authentication": {
                    provider: "BTP"
                },
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
        }
    }
}

const _config = {
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/xsuaa/",
    capabilities: multiRemoteCapability
}

const config = merge(baseConf, _config)
config.specs = [resolve("./test/e2e/multiremote.test.ts"), resolve("./test/e2e/BasicMultiRemoteAuthentication.test.ts")]
export { config }
