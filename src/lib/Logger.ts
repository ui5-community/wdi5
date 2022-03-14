import { chalk as console } from "./coloredConsole"
import { wdi5LogLevel } from "../types/wdi5.types"

export class Logger {
    private static instance: Logger | null = null
    private constructor() {
        // eliminate creating new instances
    }

    private prefix = "[wdi5]"
    private logLevel: wdi5LogLevel = "error"

    static getInstance(): Logger {
        if (Logger.instance === null) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }

    getLogLevel(): wdi5LogLevel {
        return this.logLevel
    }

    setLogLevel(level: wdi5LogLevel): void {
        this.logLevel = level
    }

    error(msg: string, ..._: string[]) {
        if (this.logLevel !== "silent") {
            console.red(this.prefix, msg, ..._)
        }
    }
    warn(msg: string, ..._: string[]) {
        if (this.logLevel !== "silent") {
            console.yellow(this.prefix, msg, ..._)
        }
    }
    info(msg: string, ..._: string[]) {
        if (this.logLevel === "verbose") {
            console.blue(this.prefix, msg, ..._)
        }
    }
    success(msg: string, ..._: string[]) {
        if (this.logLevel === "verbose") {
            console.green(this.prefix, msg, ..._)
        }
    }
    log(msg: string, ..._: string[]) {
        if (this.logLevel !== "silent") {
            console.default(this.prefix, msg, ..._)
        }
    }
    debug(msg: string, ..._: string[]) {
        if (this.logLevel === "verbose") {
            console.magenta(this.prefix, msg, ..._)
        }
    }
}
