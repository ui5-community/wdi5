export const config = {
    wdi5: {
        waitForUI5Timeout: 29000 // [optional] {number}, default: 15000; maximum waiting time in milliseconds while checking for UI5 availability
    },
    baseUrl: "http://localhost:8080/index.html",

    // services: [bs|sauce|...],

    specs: ["./test/e2e/**/*.test.ts"],
    // these are for authentication tests only
    exclude: [
        "./test/e2e/Custom.test.ts",
        "./test/e2e/multiremote.test.ts",
        "./test/e2e/BasicMultiRemoteAuthentication.test.ts",
        "./test/e2e/Authentication.test.ts",
        "./test/e2e/ui5-late.test.ts"
    ],

    logLevel: "error",
    bail: 0,

    waitforTimeout: 29000,
    connectionRetryTimeout: 29000,
    connectionRetryCount: 3,

    reporters: ["spec"],

    framework: "mocha",
    mochaOpts: {
        ui: "bdd",
        timeout: 60000
    }
}
