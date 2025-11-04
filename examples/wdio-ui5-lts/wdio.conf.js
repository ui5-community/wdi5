// Get UI5 version from CLI parameter --ui5
// This is a workaround to make testing multiple UI5 versions easier, eg, --ui5=1.136
const ui5Version = process.argv.find((argument) => argument.includes("--ui5=")).split("=")[1]
const url = `https://ui5.sap.com/${ui5Version}/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html`

export const config = {
    wdi5: {
        logLevel: "verbose",
        // Increase timeout to handle "waitAsync is already running" errors
        waitforui5Timeout: 30000
    },
    baseUrl: url,

    services: ["ui5"],
    specs: ["./**/*.test.js"],
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: "chrome",
            // browserVersion: "stable",
            "goog:chromeOptions": {
                args: process.argv.includes("--headless")
                    ? ["window-size=1440,800", "headless", "disable-gpu"]
                    : ["window-size=1440,800"]
            }
        }
    ],
    logLevel: "error",

    reporters: ["spec"],

    framework: "mocha"
}
