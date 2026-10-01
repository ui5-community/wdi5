import { baseConfig as rootBaseConfig } from "../../../wdio.root-base.conf.cjs"

/**
 * The new test structure shares test scripts among many apps
 * Localhost port is dynamic and vary per app
 * injectUI5 tests need to navigate to localhost
 * Variable browser.config.baseUrl cannot be used as it starts with an external URL
 * Variable globalThis.localhostUrl is used to set localhost URL
 * Dynamic tests get localhost URL from globalThis.localhostUrl if required
 * This allows multiple apps to reuse the same test scripts at once
 */
globalThis.localhostUrl = "http://localhost:8082/index.html"

export const reusableTestScriptsPath = "../../../reusable-test-scripts/dist/esm/ui5-local-apps"

export const baseConfig = {
    ...rootBaseConfig,
    baseUrl: "http://localhost:8082/index.html"
}
