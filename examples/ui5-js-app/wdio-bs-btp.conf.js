const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") })
const merge = require("deepmerge")
const bs_conf = require("./wdio-browserstack.conf")

const _config = {
    maxInstances: 4,
    networkLogs: "true",
    baseUrl:
        "https://davinci.cpp.cfapps.eu10.hana.ondemand.com/474a7c0c-c364-4075-b53e-983472d76120.basicservice.testSample-1.0.0/index.html"
}

let conf = merge(bs_conf.config, _config)

exports.config = conf
