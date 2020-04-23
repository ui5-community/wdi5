
// @ts-check
let _logLevel = "error"; // default

/**
 * module to encapsulate console logging functions error, log, info, warn
 */
module.exports = {

    /**
     * @return currently set logLevel
     */
    getLogLevel: () => {
        return _logLevel;
    },

    /**
     * @param logLevel {String} error | verbose | silent
     * @retunr currently set loglevel
     */
    setLoglevel: (logLevel) => {
        switch (logLevel) {
            case "error":
            case "": {
                _logLevel = "error"
                break;
            }
            case "verbose": {
                _logLevel = "verbose"
                break;
            }
            case "silent": {
                _logLevel = "silent"
                break;
            }
            default: {
                console.error("no valid log level was set -> no change")
            }
        }
        return _logLevel;
    },

    /**
     * @param {String} Message
     */
    error: (logMessage, ...a) => {
        if (_logLevel !== "silent") {
            console.error(logMessage, ...a);
        }
    },

    /**
     * @param {String} Message
     */
    log: (logMessage, ...a) => {
        if (_logLevel === "verbose") {
            console.log(logMessage, ...a);
        }
    },

    /**
     * @param {String} Message
     */
    info: (logMessage, ...a) => {
        if (_logLevel === "verbose") {
            console.info(logMessage, ...a);
        }
    },

    /**
     * @param {String} Message
     */
    warn: (logMessage, ...a) => {
        if (_logLevel === "verbose") {
            console.warn(logMessage, ...a);
        }
    }
}
