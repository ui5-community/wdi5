const { join } = require("path")
const { baseConfig } = require("./wdio.base.conf")
const merge = require("deepmerge")

const _config = {
    wdi5: {
        url: "#",
        logLevel: "verbose"
    },
    logLevel: "trace",
    specs: [join("webapp", "test", "e2e", "**/*.test.js")],
    exclude: [join("webapp", "test", "e2e", "ui5-late.test.js")],
    logLevel: "error",
    bail: 0,
    baseUrl: "http://localhost:8888"
}

exports.config = merge(baseConfig, _config)
