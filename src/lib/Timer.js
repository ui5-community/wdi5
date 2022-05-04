var marky
import("marky").then((_marky) => {
    marky = _marky
})

// FIXME: dont know why this is not working
// var marky = import("marky").then((module) => module)

var instance
/**
 *
 */
class Timer {
    start(label) {
        console.time(label)
    }
    stop(label) {
        console.timeEnd(label)
    }
    timelog(label) {
        console.time(label)
    }
    timeStamp(label) {
        console.timeStamp(label)
    }
}

module.exports = {
    getInstance() {
        if (!instance) {
            instance = new Timer()
        }
        return instance
    },
    timerStart(label) {
        marky.mark(label)
    },
    timerStop(label) {
        return marky.stop(label)
    }
}
