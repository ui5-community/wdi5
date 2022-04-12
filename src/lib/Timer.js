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
    }
}
