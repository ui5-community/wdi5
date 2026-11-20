import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    specs: [
        `${reusableTestScriptsPath}/allControls.test.js`,
        `${reusableTestScriptsPath}/basic.test.js`,
        `${reusableTestScriptsPath}/fluent-async-api.test.js`,
        `${reusableTestScriptsPath}/hash-nav.test.js`,
        `${reusableTestScriptsPath}/wdioBridge.test.js`
    ],
    capabilities: [
        {
            ...baseConfig.capabilities[0],
            "wdio:enforceWebDriverClassic": true
        }
    ]
}
