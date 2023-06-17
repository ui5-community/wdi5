const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")

const _config = {
    specs: [join("..", "webapp", "test", "e2e", "basic.test.js"), join("webapp", "test", "e2e", "hash-nav.test.js")],
    baseUrl: "http://localhost:8080/index.html"
}

exports.config = merge(baseConfig, _config)
