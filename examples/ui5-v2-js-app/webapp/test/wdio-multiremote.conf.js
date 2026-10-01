import { join } from "node:path"
import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.js"

// avoid multiple chrome sessions
const baseCapabilities = structuredClone(baseConfig.capabilities)
baseConfig.capabilities = []

export const config = {
    ...baseConfig,
    wdi5: {
        screenshotPath: join("report", "screenshots")
    },
    capabilities: {
        one: {
            capabilities: { ...structuredClone(baseCapabilities[0]) }
        },
        two: {
            capabilities: { ...structuredClone(baseCapabilities[0]) }
        }
    },
    specs: [`${reusableTestScriptsPath}/multiremote.test.js`]
}
