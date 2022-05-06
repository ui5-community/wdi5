var marky
import("marky").then((_marky) => {
    marky = _marky
})
// FIXME: dont know why this is not working
// var marky = import("marky").then((module) => module)

/**
 * Timer to mesure performance in JS apps
 */

var instance
/**
 * do not use the Timer Class
 */
class Timer {
    start(label) {
        console.time(label)
    }
    stop(label) {
        console.timeEnd(label)
    }
    timelog(label) {
        return console.timeLog(label)
    }
    timeStamp(label) {
        returnconsole.timeStamp(label)
    }
}

module.exports = {
    getInstance() {
        if (!instance) {
            instance = new Timer()
        }
        return instance
    },

    getEntries() {
        return marky.getEntries()
    },
    clear() {
        marky.clear()
    },
    start(label) {
        marky.mark(label)
    },
    stop(label) {
        const _result = marky.stop(label)
        const result = { name: _result.name, duration: _result.duration }
        console.log(result)
        return result
    }
}
