import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    specs: [
        `${reusableTestScriptsPath}/allControls.test.ts`,
        `${reusableTestScriptsPath}/basic.test.ts`,
        `${reusableTestScriptsPath}/fluent-async-api.test.ts`,
        `${reusableTestScriptsPath}/hash-nav.test.ts`,
        `${reusableTestScriptsPath}/wdioBridge.test.ts`
    ],
    capabilities: [
        {
            ...baseConfig.capabilities[0],
            "wdio:enforceWebDriverClassic": true
        }
    ]
}
