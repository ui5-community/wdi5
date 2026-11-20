// Import/require to test whether ESM/CJS modules are working as expected
import _wdi5 from "wdio-ui5-service"
import { baseConfig } from "../wdio.root-base.conf.cjs"

export const config = {
    ...baseConfig,
    specs: ["../reusable-test-scripts/dist/esm/ui5-remote-apps/*.test.{js,mjs}"],
    baseUrl: "https://ui5.sap.com/1.136.19/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html"
}
