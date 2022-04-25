exports.config = {
    specs: ["test/e2e/*.test.js"],
    hostname: "selenium-hub", // tests running inside the container should connect to the same network
    port: 4444,
    runner: "local",
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
                    "--allow-insecure-localhost",
                    "--ignore-ssl-errors=yes",
                    "--ignore-certificate-errors"
                ]
            }
        },
        {
            // maxInstances can get overwritten per capability. So if you have an in house Selenium
            // grid with only 5 firefox instance available you can make sure that not more than
            // 5 instance gets started at a time.
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
            },
            // If outputDir is provided WebdriverIO can capture driver session logs
            // it is possible to configure which logTypes to exclude.
            // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
            excludeDriverLogs: ["bugreport", "server"]
            //
            // Parameter to ignore some or all Puppeteer default arguments
            // ignoreDefaultArgs: ['-foreground'], // set value to true to ignore all default arguments
        }
    ],
    wdi5: {
        // path: "", // commented out to use the default paths
        screenshotPath: "report/screenshots",
        logLevel: "verbose", // error | verbose | silent
        url: "#"
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
