const { baseConfig, reusableTestScriptsPath } = require("./wdio.base.conf.cjs")

exports.config = {
    ...baseConfig,
    specs: [
        `${reusableTestScriptsPath}/allControls.test.cjs`,
        `${reusableTestScriptsPath}/basic.test.cjs`,
        `${reusableTestScriptsPath}/fluent-async-api.test.cjs`,
        `${reusableTestScriptsPath}/hash-nav.test.cjs`,
        `${reusableTestScriptsPath}/wdioBridge.test.cjs`
    ],
    capabilities: [
        {
            ...baseConfig.capabilities[0],
            "wdio:enforceWebDriverClassic": true
        }
    ]
}
