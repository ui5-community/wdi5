const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")

const _config = {
    wdi5: {
        url: "index.html"
    },
    specs: [join("webapp", "test", "e2e", "basic.test.js"), join("webapp", "test", "e2e", "hash-nav.test.js")],
    baseUrl: "http://localhost:8080"
}

exports.config = merge(baseConfig, _config)
