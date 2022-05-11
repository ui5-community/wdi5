const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") })
const { join } = require("path")
const { wdi5 } = require("wdio-ui5-service")
const merge = require("deepmerge")

const btp_conf = require("./wdio-btp.conf")
const bs_conf = require("./wdio-browserstack.conf")

const _config = {
    services: ["ui5", "shared-store"],
    specs: ["examples/ui5-js-app/webapp/test/e2e/basic.test.js"],
    wdi5: {
        skipInjectUI5OnStart: true,
        url: "index.html"
    },
    baseUrl:
        "https://davinci.cpp.cfapps.eu10.hana.ondemand.com/474a7c0c-c364-4075-b53e-983472d76120.basicservice.testSample-1.0.0/index.html"
}

wdi5.getLogger().info(
    `starting with \n MULTI_IDENT_PROVIDER: ${process.env.MULTI_IDENT_PROVIDER} \n USE_GLOBAL_ID: ${process.env.USE_GLOBAL_ID} \n USERNAME: ${process.env.USERNAME} `
)

if (!(process.env.USERNAME && process.env.PASSWORD)) {
    wdi5.getLogger().error("no username and/ or password for login provided")
}

let conf = merge(bs_conf, btp_conf)

conf.services = _config.services
conf.wdi5.skipInjectUI5OnStart = _config.wdi5.skipInjectUI5OnStart
conf.wdi5.url = _config.wdi5.url
conf.baseUrl = _config.baseUrl
conf.specs = _config.specs

exports.config = conf
