// Import/require to test whether ESM/CJS modules are working as expected
const _wdi5 = require("wdio-ui5-service")
const { baseConfig } = require("../wdio.root-base.conf.cjs")

const config = {
    ...baseConfig,
    specs: ["../reusable-test-scripts/dist/cjs/ui5-remote-apps/*.test.{js,cjs}"],
    baseUrl: "https://ui5.sap.com/1.136.19/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html"
}

module.exports = { config }
