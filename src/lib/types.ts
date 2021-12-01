import { Path } from "typescript"
import Log from "sap/base/Log"
import RecordReplay from "sap/ui/test/RecordReplay"
import { ControlSelector } from "sap/ui/test/RecordReplay"

export type wdi5LogLevel = "silent" | "error" | "verbose"

export interface wdi5Config extends WebdriverIO.Config {
    wdi5: {
        /** wdi5-specific logging of UI5-related operations */
        logLevel?: wdi5LogLevel
        /**
         * FQDN-suffix to append to `baseUrl` of wdio config,
         * typically "index.html"
         * @example http://localhost:8080/index.html -> "index.html"
         * @example https://ui5.sap.com/anotherIndex.html -> "anotherIndex.html"
         */
        url: string
        /** path relative to the command `wdio` is run from to store screenshots */
        screenshotPath?: string
        /**
         * late-inject wdi5 <-> UI5 bridge, useful for testing in hybrid non-UI5/UI5 apps
         * TODO: link to document on how to inject late programmatically
         */
        skipInjectUI5OnStart?: boolean
    }
}

export interface wdi5Bridge extends Window {
    bridge: RecordReplay
    wdi5: {
        createMatcher: (selector: ControlSelector) => ControlSelector
        getUI5CtlForWebObj: (ui5Control: any) => any
        retrieveControlMethods: (ui5Control: any) => string[]
        isPrimitive: (value: any) => boolean
        createControlIdMap: (ui5Controls: any[]) => Map<"id", string>
        createControlId: (ui5Control: any) => { id: string }
        isInitialized: boolean
        Log: Log
        waitForUI5Options: {
            timeout: number
            interval: number
        }
    }
}
