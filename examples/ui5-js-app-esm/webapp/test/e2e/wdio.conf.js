export const config = {
    wdi5: {
        logLevel: "verbose"
    },
    baseUrl: "http://localhost:8082/index.html",

    services: ["ui5"],
    specs: ["./**/*.test.js"],
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: "chrome",
            browserVersion: "stable",
            "goog:chromeOptions": {
                args:
                    process.argv.indexOf("--headless") > -1
                        ? ["window-size=1440,800", "--headless"]
                        : ["window-size=1440,800"]
            }
        }
    ],
    logLevel: "error",

    reporters: ["spec"],

    framework: "mocha"
}
