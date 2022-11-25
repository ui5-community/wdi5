const { getBrowsers } = require("./scripts/getBrowsers")

// TODO: use wdio.base.conf.js
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
    hostname: "selenium-hub", // tests running inside the container should connect to the same network
    port: 4444,
    runner: "local",
    path: "/wd/hub",
    maxInstances: 1,
    capabilities: [],
    wdi5: {
        screenshotPath: "report/screenshots",
        logLevel: "error" // error | verbose | silent
    },
    services: ["ui5"],
    logLevel: "info",
    logLevels: {
        webdriver: "error"
    },
    baseUrl: "http://test-app:8888",
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 60000,
    connectionRetryCount: 3,
    framework: "mocha",
    reporters: ["spec"],
    mochaOpts: {
        ui: "bdd",
        timeout: 60000
    }
}

const browsers = getBrowsers()

if (browsers) {
    if (browsers.includes("chrome")) {
        _config.capabilities.push(chrome)
    }
    if (browsers.includes("firefox")) {
        _config.capabilities.push(firefox)
    }
} else {
    // nothing defined -> start all
    _config.capabilities.push(chrome)

    _config.capabilities.push(firefox)
}

exports.config = _config
