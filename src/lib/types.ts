import { Path } from "typescript"

export interface wdi5Config extends WebdriverIO.Config {
    wdi5: {
        logLevel?: "silent" | "error" | "verbose"
        url: string
        screenshotPath?: Path
        skipInjectUI5OnStart?: boolean
    }
}
