import * as dotenv from "dotenv"
dotenv.config()

import { config as shared } from "./shared.conf"

const _ts = new Date()
const ts = `${_ts.getFullYear()}-${_ts.getMonth() + 1}-${
    _ts.getDay() + 1
}_${_ts.getHours()}:${_ts.getMinutes()}:${_ts.getSeconds()}`

const defaults = {
    projectName: "wdi5-ts-app",
    buildName: `${process.env.USER}::${ts}`,
    debug: "true",
    consoleLogs: "verbose"
}

const _config = {
    services: [["browserstack", { browserstackLocal: true }], "ui5"],
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,

    maxInstances: 5,
    maxInstancesPerCapability: 1,
    capabilities: [
        // Windows
        {
            browserName: "Edge",
            browserVersion: "latest",
            "bstack:options": {
                os: "Windows",
                osVersion: "11",
                ...defaults
            }
        },
        {
            browserName: "Chrome",
            browserVersion: "latest",
            "bstack:options": {
                os: "Windows",
                osVersion: "11",
                ...defaults
            }
        },
        {
            browserName: "Firefox",
            browserVersion: "latest",
            "bstack:options": {
                os: "Windows",
                osVersion: "11",
                ...defaults
            }
        },
        // macOS
        {
            browserName: "Safari",
            browserVersion: "latest",
            "bstack:options": {
                os: "OS X",
                osVersion: "Ventura",
                ...defaults
            }
        },
        {
            browserName: "Edge",
            browserVersion: "latest",
            "bstack:options": {
                os: "OS X",
                osVersion: "Ventura",
                ...defaults
            }
        },
        {
            browserName: "Chrome",
            browserVersion: "latest",
            "bstack:options": {
                os: "OS X",
                osVersion: "Ventura",
                ...defaults
            }
        },
        {
            browserName: "Firefox",
            browserVersion: "latest",
            "bstack:options": {
                os: "OS X",
                osVersion: "Ventura",
                ...defaults
            }
        }
    ]
}

export const config = Object.assign(shared, _config)
