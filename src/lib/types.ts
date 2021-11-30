import { Path } from "typescript"

export type wdi5LogLevel = "silent" | "error" | "verbose"

export interface wdi5Config extends WebdriverIO.Config {
    wdi5: {
        logLevel?: wdi5LogLevel
        url: string
        screenshotPath?: Path
        skipInjectUI5OnStart?: boolean
    }
}
