import { chalk as console } from "./coloredConsole"
import marky = require("marky")

/**
 * Timer to mesure performance in wdi5 or TS apps
 */

let active = true

/**
 * do not use the Timer Class
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

export function getEntries() {
    return marky.getEntries()
}

export function clear() {
    marky.clear()
}

export function stop(label: string) {
    if (active) {
        const _result = marky.stop(label)
        const result = { name: _result.name, duration: _result.duration }
        console.log(result)
        return result
    }

    return { name: "inactive", duration: "inactive" }
}
