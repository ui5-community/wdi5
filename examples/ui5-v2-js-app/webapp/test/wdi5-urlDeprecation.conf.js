import { baseConfig, reusableTestScriptsPath } from "./wdio.base.conf.js"

export const config = {
    ...baseConfig,
    wdi5: {
        url: "#"
    },
    specs: [`${reusableTestScriptsPath}/**/hash-nav.test.js`],
    exclude: [`${reusableTestScriptsPath}/ui5-late.test.js`, `${reusableTestScriptsPath}/multiremote.test.js`]
}
