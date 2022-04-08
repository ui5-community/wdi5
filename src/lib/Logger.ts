import { chalk as console } from "./coloredConsole"
import { wdi5LogLevel } from "../types/wdi5.types"

export class Logger {
    private static instance: Record<string, Logger> = {}
    private constructor(sPrefix = "wdi5") {
        this.prefix = `[${sPrefix}]`
    }

    private prefix: string
    private logLevel: wdi5LogLevel = "error"

    static getInstance(sPrefix = "wdi5"): Logger {
        if (Logger.instance === null || !Logger.instance[sPrefix]) {
            Logger.instance[sPrefix] = new Logger(sPrefix)
        }
        return Logger.instance[sPrefix]
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
