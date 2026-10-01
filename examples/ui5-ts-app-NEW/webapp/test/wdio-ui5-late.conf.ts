import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    wdi5: {
        skipInjectUI5OnStart: true,
        waitForUI5Timeout: 654321
    },
    specs: [`${reusableTestScriptsPath}/ui5-late.test.ts`, `${reusableTestScriptsPath}/ui5-features-available.test.ts`],
    baseUrl: "https://github.com/ui5-community/wdi5/"
}
