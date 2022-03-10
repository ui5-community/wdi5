exports.config = {
    runner: "local",
    path: "/",
    specs: ["*.test.js"],
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: "chrome",
            "goog:chromeOptions": {
                w3c: false,
                args: [
                    "--headless",
                    "--no-sandbox",
                    "--whitelisted-ips",
                    "--disable-gpu",
                    "--disable-software-rasterizer",
                    "--disable-dev-shm-usage",
                    "--disable-infobars"
                ]
            }
        }
    ],
    wdi5: {
        screenshotPath: "report/screenshots",
        logLevel: "error", // error | verbose | silent
        platform: "browser", // electron, browser, android, ios
        url: "index.html",
        deviceType: "web"
    },

    services: [
        "ui5", // service is officially registered "as a service" with webdriver.io
        "chromedriver"
    ],
    logLevel: "error",
    logLevels: {
        webdriver: "error"
    },
    bail: 0,
    baseUrl: "https://openui5.netweaver.ondemand.com/",
    waitforTimeout: 10000,
    framework: "mocha",
    mochaOpts: {
        timeout: 50000
    },
    connectionRetryTimeout: 60000,
    connectionRetryCount: 3,
    reporters: ["spec"]
}
