import { baseConfig } from "../wdio.root-base.conf.cjs"

export const config = {
    ...baseConfig,
    specs: ["../reusable-test-scripts/dist/esm/ui5-remote-apps/*.test.js"],
    baseUrl: "https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html",
    capabilities: [
        {
            ...baseConfig.capabilities[0],
            "wdio:enforceWebDriverClassic": true
        }
    ]
}
