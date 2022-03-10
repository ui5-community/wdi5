const path = require("path")

exports.config = {
    // TODO: change to real wdi5 tests
    specs: [path.join("test", "service", "*.test.js")],
    hostname: "selenium-hub", // tests running inside the container should connect to the same network
    port: 4444,
    path: "/wd/hub",
    maxInstances: 1,
    capabilities: [
        {
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
                    "--allow-insecure-localhost"
                ]
            }
        }
    ],
    wdi5: {
        // path: "", // commented out to use the default paths
        screenshotPath: path.join("test", "report", "screenshots"),
        logLevel: "error", // error | verbose | silent
        platform: "browser", // electron, browser, android, ios
        url: "",
        deviceType: "web"
    },
    services: ["ui5"],
    logLevel: "error",
    logLevels: {
        webdriver: "error"
    },
    baseUrl: "http://test-app/",
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
