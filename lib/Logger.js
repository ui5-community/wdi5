
// @ts-check
let _logLevel = "error"; // default

/**
 * module to encapsulate console logging
 */
module.exports = {

    getLogLevel: () => {
        return _logLevel;
    },

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
        }
        _logLevel = logLevel;
    },
    error: (logMessage) => {
        if (_logLevel !== "silent") {
            console.error(logMessage);
        }
    },
    log: (logMessage) => {
        if (_logLevel === "verbose") {
            console.log(logMessage);
        }
    },
    info: (logMessage) => {
        if (_logLevel === "verbose") {
            console.info(logMessage);
        }
    },
    warn: (logMessage) => {
        if (_logLevel === "verbose") {
            console.warn(logMessage);
        }
    }
}
