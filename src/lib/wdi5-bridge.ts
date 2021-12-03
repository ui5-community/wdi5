import { wdi5Config } from "../types/wdi5.types"

import { addWdi5Commands } from "./wdi5-commands"

import { Logger as _Logger } from "./Logger"
const Logger = _Logger.getInstance()

export async function start(config: wdi5Config) {
    // jump-start the desired log level
    Logger.setLogLevel(config.wdi5.logLevel)

    // TODO: document that we require wdio.config.baseUrl with a trailing slash à la "http://localhost:8080/"
    if (config.wdi5.url !== "") {
        Logger.info(`open url: ${config.wdi5.url}`)
        await browser.url(config.wdi5.url)
    } else {
        Logger.info("open url with fallback '#' (this is not causing any issues since its is removed for navigation)")
        await browser.url("#")
    }

    addWdi5Commands()
}

export async function injectUI5() {}
