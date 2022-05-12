const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") })
const merge = require("deepmerge")
const bs_conf = require("./wdio-browserstack.conf")
const { join } = require("path")

const _config = {
    specs: [join("webapp", "test", "e2e", "basic.test.js")],
    baseUrl:
        "https://davinci.cpp.cfapps.eu10.hana.ondemand.com/474a7c0c-c364-4075-b53e-983472d76120.basicservice.testSample-1.0.0/index.html"
}

let conf = merge(bs_conf.config, _config)

exports.config = conf
