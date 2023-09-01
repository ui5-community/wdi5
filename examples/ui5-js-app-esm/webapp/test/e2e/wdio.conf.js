export const config = {
    wdi5: {
        logLevel: "verbose"
    },
    baseUrl: "http://localhost:8080/index.html",

    services: ["ui5"],
    specs: ["./**/*.test.js"],
    maxInstances: 1,
    capabilities: [
        {
            maxInstances: 1,
            browserName: "chrome"
        }
    ],
    logLevel: "error",

    reporters: ["spec"],

    framework: "mocha"
}
