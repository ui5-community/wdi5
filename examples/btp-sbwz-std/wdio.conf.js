import { baseConfig } from "../wdio.root-base.conf.cjs"

export const config = {
    ...baseConfig,
    wdi5: {
        logLevel: "verbose",
        waitForUI5Timeout: 29000,
        btpWorkZoneEnablement: true
    },
    specs: ["./*.test.js"],
    // TODO: Set baseUrl to your BTP WorkZone Standard tenant URL
    baseUrl: "THIS_MUST_BE_YOUR_BTP_WORKZONE_STD_TENANT_URL"
}
