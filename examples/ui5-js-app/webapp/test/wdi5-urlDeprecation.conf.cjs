const { baseConfig, reusableTestScriptsPath } = require("./wdio.base.conf.cjs")

exports.config = {
    ...baseConfig,
    wdi5: {
        url: "#"
    },
    specs: [`${reusableTestScriptsPath}/**/hash-nav.test.cjs`],
    exclude: [`${reusableTestScriptsPath}/ui5-late.test.cjs`, `${reusableTestScriptsPath}/multiremote.test.cjs`]
}
