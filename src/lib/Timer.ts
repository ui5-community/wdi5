import { chalk as console } from "./coloredConsole"
// import { marky } from "marky"
import marky = require("marky")

/**
 *
 */
export class Timer {
    private static instance: Timer

    static getInstance(): Timer {
        if (!Timer.instance) {
            Timer.instance = new Timer()
        }
        return Timer.instance
    }

    start(label: string) {
        console.time(label)
    }
    stop(label: string) {
        console.timeEnd(label)
    }
    timelog(label: string) {
        console.time(label)
    }
    timeStamp(label: string) {
        console.timeStamp(label)
    }
}

export function start(label: string) {
    marky.mark(label)
}

export function stop(label: string) {
    return marky.stop(label)
}
