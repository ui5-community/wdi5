import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    specs: [`${reusableTestScriptsPath}/**/*.test.ts`],
    exclude: [`${reusableTestScriptsPath}/ui5-late.test.ts`, `${reusableTestScriptsPath}/multiremote.test.ts`]
}
