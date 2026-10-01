const { baseConfig, reusableTestScriptsPath } = require("./wdio.base.conf.cjs")

exports.config = {
    ...baseConfig,
    wdi5: {
        skipInjectUI5OnStart: true,
        waitForUI5Timeout: 654321
    },
    specs: [
        `${reusableTestScriptsPath}/ui5-late.test.cjs`,
        `${reusableTestScriptsPath}/ui5-features-available.test.cjs`
    ],
    baseUrl: "https://github.com/ui5-community/wdi5/"
}
