import { chalk as console } from "./coloredConsole"
import marky = require("marky")

let active = true

/**
 *
 */
export class Timer {
    private static instance: Timer
    private active = true

    static getInstance(): Timer {
        if (!Timer.instance) {
            Timer.instance = new Timer()
        }
        return Timer.instance
    }

    disable() {
        this.active = false
    }

    enable() {
        this.active = true
    }

    start(label: string) {
        if (this.active) {
            console.time(label)
        }
    }
    stop(label: string) {
        if (this.active) {
            console.timeEnd(label)
        }
    }
    timelog(label: string) {
        if (this.active) {
            console.time(label)
        }
    }
    timeStamp(label: string) {
        if (this.active) {
            console.timeStamp(label)
        }
    }
}

export function disable() {
    active = false
}

export function enable() {
    active = true
}

export function start(label: string) {
    if (active) {
        marky.mark(label)
    }
}

export function stop(label: string) {
    if (active) {
        const result = marky.stop(label)
        console.log(result)
        return result
    }
    return { startTime: "inactive", name: "inactive", duration: "inactive", entryType: "inactive" }
}
