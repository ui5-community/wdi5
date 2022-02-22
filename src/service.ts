import { Capabilities, Options, Services } from "@wdio/types"

import { start, injectUI5, setup, checkForUI5Page } from "./lib/wdi5-bridge"
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
        Logger.info("started")
        await setup(this._config)
        Logger.info("setup complete")
        if (!this._config.wdi5.skipInjectUI5OnStart) {
            await injectUI5(this._config)
        } else {
            Logger.warn("skipped wdi5 injection!")
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

    /**
     * this is a helper function to late-inject ui5 at test-time
     * it relays the the wdio configuration (set in the .before() hook to the browser.config parameter by wdio)
     * to the injectUI5 function of the actual wdi5-bridge
     */
    async injectUI5() {
        if (await checkForUI5Page()) {
            await injectUI5(browser.config as wdi5Config)
        } else {
            throw new Error("wdi5: no UI5 page/app present to work on :(")
        }
    }
}
