import * as dotenv from "dotenv"
dotenv.config()

import { config as shared } from "./shared.conf"

const _ts = new Date()
const ts = `${_ts.getFullYear()}-${_ts.getMonth() + 1}-${
    _ts.getDay() + 1
}_${_ts.getHours()}:${_ts.getMinutes()}:${_ts.getSeconds()}`

const defaultsWin = {
    name: "wdi5-ts-app",
    build: `${process.env.USER}::${ts}`,
    screenResolution: "1400x1050"
    // extendedDebugging: true
}
const defaultsMac = {
    name: "wdi5-ts-app",
    build: `${process.env.USER}::${ts}`,
    screenResolution: "1440x900",
    extendedDebugging: true
}
const acceptInsecureCerts = true

const _config = {
    connectionRetryTimeout: 100000,
    connectionRetryCount: 1,

    services: [["sauce", { sauceConnect: true }], "ui5"],
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    region: "eu",

    maxInstances: 5,
    maxInstancesPerCapability: 5,
    capabilities: [
        // Windows
        {
            browserName: "MicrosoftEdge",
            browserVersion: "latest",
            platformName: "Windows 11",
            acceptInsecureCerts,
            "sauce:options": {
                ...defaultsWin
            }
        },
        {
            browserName: "chrome",
            browserVersion: "latest",
            platformName: "Windows 11",
            acceptInsecureCerts,
            "sauce:options": {
                ...defaultsWin
            }
        },
        {
            browserName: "firefox",
            browserVersion: "latest",
            platformName: "Windows 11",
            acceptInsecureCerts,
            "sauce:options": {
                ...defaultsWin
            }
        },
        // macOS
        {
            browserName: "safari",
            browserVersion: "latest",
            platformName: "macOS 13",
            acceptInsecureCerts,
            "sauce:options": {
                ...defaultsMac
            }
        },
        {
            browserName: "MicrosoftEdge",
            browserVersion: "latest",
            platformName: "macOS 13",
            acceptInsecureCerts,
            "sauce:options": {
                ...defaultsMac
            }
        },
        {
            browserName: "chrome",
            browserVersion: "latest",
            platformName: "macOS 13",
            acceptInsecureCerts,
            "sauce:options": {
                ...defaultsMac
            }
        },
        {
            browserName: "firefox",
            browserVersion: "latest",
            platformName: "macOS 13",
            acceptInsecureCerts,
            "sauce:options": {
                ...defaultsMac
            }
        }
    ]
}

export const config = Object.assign(shared, _config)
