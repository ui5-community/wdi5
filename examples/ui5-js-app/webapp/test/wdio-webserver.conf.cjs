const { baseConfig, reusableTestScriptsPath } = require("./wdio.base.conf.cjs")

exports.config = {
    ...baseConfig,
    specs: [`${reusableTestScriptsPath}/**/*.test.cjs`],
    exclude: [`${reusableTestScriptsPath}/ui5-late.test.cjs`, `${reusableTestScriptsPath}/multiremote.test.cjs`]
}
