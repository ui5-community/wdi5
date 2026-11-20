import { baseConfig } from "../wdio.root-base.conf.cjs"

// Get UI5 version from CLI parameter --ui5
// This is a workaround to make testing multiple UI5 versions easier, eg, --ui5=1.136
const ui5Version = process.argv.find((argument) => argument.includes("--ui5=")).split("=")[1]

export const config = {
    ...baseConfig,
    specs: ["./**/*.test.js", "../reusable-test-scripts/dist/esm/ui5-remote-apps/*.test.js"],
    baseUrl: `https://ui5.sap.com/${ui5Version}/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html`
}
