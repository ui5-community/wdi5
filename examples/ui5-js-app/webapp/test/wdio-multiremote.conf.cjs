const { join } = require("node:path")
const { baseConfig, reusableTestScriptsPath } = require("./wdio.base.conf.cjs")

// avoid multiple chrome sessions
const baseCapabilities = structuredClone(baseConfig.capabilities)
baseConfig.capabilities = []

exports.config = {
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
    specs: [`${reusableTestScriptsPath}/multiremote.test.cjs`]
}
