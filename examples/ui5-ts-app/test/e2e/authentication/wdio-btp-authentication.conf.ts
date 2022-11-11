import { config as baseConf } from "./wdio-base.conf"
import { wdi5Capabilites } from "wdio-ui5-service/dist/types/wdi5.types"
import merge from "ts-deepmerge"

const capability: wdi5Capabilites = {
    "wdi5:authentication": {
        provider: "BTP"
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
    baseUrl: "https://wdi5-sample-app.cfapps.eu20.hana.ondemand.com/xsuaa/",
    capabilities: [capability]
}
export const config = merge(baseConf, _config)
