import { chalk as console } from "./coloredConsole"
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
