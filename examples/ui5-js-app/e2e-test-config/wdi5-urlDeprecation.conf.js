const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")

const _config = {
    // check that the url property still works even though it is deprecated
    wdi5: {
        url: "#"
    },
    specs: [join("webapp", "test", "e2e", "**/hash-nav.test.js")],
    exclude: [join("webapp", "test", "e2e", "ui5-late.test.js"), join("webapp", "test", "e2e", "multiremote.test.js")],
    baseUrl: "http://localhost:8888"
}

exports.config = merge(baseConfig, _config)
