import { Path } from "typescript"
import Log from "sap/base/Log"
import RecordReplay from "sap/ui/test/RecordReplay"
import { ControlSelector } from "sap/ui/test/RecordReplay"

export type wdi5LogLevel = "silent" | "error" | "verbose"

export interface wdi5Config extends WebdriverIO.Config {
    wdi5: {
        logLevel?: wdi5LogLevel
        url: string
        screenshotPath?: Path
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
