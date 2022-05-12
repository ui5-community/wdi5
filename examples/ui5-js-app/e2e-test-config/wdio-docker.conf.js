const { getBrowsers } = require("../scripts/getBrowsers")
const { baseConfig } = require("./wdio-docker-selenium.conf.js")
const merge = require("deepmerge")

const chrome = {
    maxInstances: 1,
    browserName: "chrome",
    acceptInsecureCerts: true,
    "goog:chromeOptions": {
        w3c: false,
        args: [
            "--headless",
            "--disable-web-security",
            "--no-sandbox",
            "--privileged",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            '--whitelisted-ips="selenium-hub"',
            "--verbose",
            "--ignore-certificate-errors",
            "--allow-insecure-localhost",
            "--ignore-ssl-errors=yes",
            "--ignore-certificate-errors"
        ]
    }
}

const firefox = {
    maxInstances: 1,
    browserName: "firefox",
    "moz:firefoxOptions": {
        // flag to activate Firefox headless mode (see https://github.com/mozilla/geckodriver/blob/master/README.md#firefox-capabilities for more details about moz:firefoxOptions)
        args: [
            "-headless",
            "-disable-web-security",
            "-no-sandbox",
            "-privileged",
            "-disable-dev-shm-usage",
            "-disable-gpu",
            '-whitelisted-ips="selenium-hub"',
            "-verbose",
            "-ignore-certificate-errors",
            "-allow-insecure-localhost",
            "-ignore-ssl-errors=yes",
            "-ignore-certificate-errors"
        ]
    }
}

const _config = {
    specs: ["test/e2e/basic.test.js"],
    hostname: "selenium-hub" // tests running inside the container should connect to the same network
}

let config = merge(baseConfig, _config)
config.services = ["ui5"]
config.capabilities = []

const browsers = getBrowsers()

if (browsers.includes("chrome")) {
    wdi5.getLogger().info(`add BROWSER: chrome`)
    config.capabilities.push(chrome)
}
if (browsers.includes("firefox")) {
    wdi5.getLogger().info(`add BROWSER: firefox`)
    config.capabilities.push(firefox)
}

exports.config = config
