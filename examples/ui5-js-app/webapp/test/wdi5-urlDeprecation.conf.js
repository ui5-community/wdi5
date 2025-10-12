const { baseConfig } = require("./wdio.base.conf")

const _config = {
    // check that the url property still works even though it is deprecated
    wdi5: {
        url: "#"
    },
    specs: ["e2e/**/hash-nav.test.js"],
    exclude: ["e2e/ui5-late.test.js", "e2e/multiremote.test.js"],
    baseUrl: "http://localhost:8081/index.html"
}

exports.config = { ...baseConfig, ..._config }
