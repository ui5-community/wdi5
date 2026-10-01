import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    specs: [`${reusableTestScriptsPath}/**/*.test.js`],
    exclude: [`${reusableTestScriptsPath}/ui5-late.test.js`, `${reusableTestScriptsPath}/multiremote.test.js`]
}
