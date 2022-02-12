import { Capabilities, Options, Services } from "@wdio/types"

import { start, injectUI5, setup } from "./lib/wdi5-bridge"
import { wdi5Config } from "./types/wdi5.types"

import { Logger as _Logger } from "./lib/Logger"
const Logger = _Logger.getInstance()

export default class Service implements Services.ServiceInstance {
    constructor(
        private _options: wdi5Config,
        private _capabilities: Capabilities.RemoteCapability,
        private _config: wdi5Config // an enhanced version of the regular wdio config
    ) {}

    async onPrepare(config, capabilities) {}

    async onWorkerStart(cid, caps, specs, args, execArgv) {}

    async beforeSession(config, capabilities, specs) {}

    async before(capabilities, specs) {
        await start(this._config)
        await setup(this._config)
        if (!this._config.wdi5.skipInjectUI5OnStart) {
            await injectUI5(this._config)
        }
    }

    async beforeSuite(suite) {}

    async beforeHook(test, context) {}

    async afterHook(test, context, { error, result, passed, duration, retries, exception, status }) {}

    async beforeTest(test, context) {}

    async beforeCommand(commandName, args) {}

    async afterCommand(commandName, args, result, error) {}

    async afterTest(test, context, { error, result, passed, duration, retries, exception, status }) {}

    async afterSuite(suite) {}

    async after(result, capabilities, specs) {}

    async afterSession(config, capabilities, specs) {}

    onComplete(exitCode, config, capabilities, results) {}

    onReload(oldSessionId, newSessionId) {}

    // async startWDI5(browser) {
    //     // UI5 bridge setup
    //     const wdi5config = (browser.config as wdi5Config).wdi5

    //     // set sapui5 version constant to browser for later switches
    //     // Before version 1.60, the only available criteria is binding browser path.
    //     // As of version 1.72, it is available as a declarative matcher
    //     // TODO: do we still need to support this?
    //     // browser._oldAPIVersion = 1.6

    //     Logger.setLogLevel(wdi5config?.logLevel || "error")

    //     // this is only to run in browser
    //     if (wdi5config && typeof wdi5config.url === "string") {
    //         if (wdi5config.url.length > 0) {
    //             Logger.info(`open url: ${wdi5config.url}`)
    //             browser.url(wdi5config.url)
    //         } else if (wdi5config.url === "") {
    //             Logger.info(
    //                 "open url with fallback (this is not causing any issues since its is removed for navigation): #"
    //             )
    //             browser.url("#")
    //         } else {
    //             // just for error logging
    //             Logger.error("not opening any url, wdi5 config contains errors")
    //         }
    //     } else {
    //         // just for error logging
    //         Logger.error("not opening any url, no url was supplied in wdi5 config")
    //     }

    //     Logger.info("wdio-ui5-service before hook")

    //     wdioUI5.setup(browser) // use wdio hooks for setting up wdio<->ui5 bridge

    //     // skip UI5 initialization on startup
    //     if (wdi5config && !wdi5config.skipInjectUI5OnStart) {
    //         await this.injectUI5()
    //     } else {
    //         Logger.warn("wdio-ui5-service skipped injecting UI5")
    //     }
    // }

    // /**
    //  * inject the wdio-ui5-service sources to the UI5 app after launch
    //  */
    // async injectUI5() {
    //     await wdioUI5.checkForUI5Page()
    //     await wdioUI5.injectUI5(browser) // needed to let the instance know that UI5 is now available for work
    // }
}
