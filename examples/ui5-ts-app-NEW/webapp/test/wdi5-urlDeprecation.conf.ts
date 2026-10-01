import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    wdi5: {
        url: "#"
    },
    specs: [`${reusableTestScriptsPath}/**/hash-nav.test.ts`],
    exclude: [`${reusableTestScriptsPath}/ui5-late.test.ts`, `${reusableTestScriptsPath}/multiremote.test.ts`]
}
