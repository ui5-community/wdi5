const console = require('./coloredConsole');

// @ts-check
let _logLevel = 'error'; // default
const _prefix = '[wdi5]';
let _logStorage = [];

/**
 * private
 * writes log entries in local storage object
 * @param {String} type
 * @param {String} _prefix
 * @param {String} logMessage
 * @param {...any} a
 */
var _writeLogStorage = (type, _prefix, logMessage, ...a) => {
    _logStorage.push(type.concat(_prefix, logMessage, ...a));
};

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
     * logs the log storage to console and retuns it
     * @returns {Array} log Messages
     */
    printLogStorage: () => {
        _logStorage.forEach((m) => {
            console.log(m);
        });
        return _logStorage;
    },

    /**
     * @param logLevel {String} error | verbose | silent
     * @retunr currently set loglevel
     */
    setLoglevel: (logLevel) => {
        switch (logLevel) {
            case 'error':
            case '': {
                _logLevel = 'error';
                break;
            }
            case 'verbose': {
                _logLevel = 'verbose';
                break;
            }
            case 'silent': {
                _logLevel = 'silent';
                break;
            }
            default: {
                console.error('no valid log level was set -> no change');
            }
        }
        return _logLevel;
    },

    /**
     * @param {String} Message
     */
    error: (logMessage, ...a) => {
        _writeLogStorage('-ERROR- ', _prefix, logMessage, ...a);
        if (_logLevel !== 'silent') {
            // all other log level
            console.red(_prefix, logMessage, ...a);
            // also throw an error
            throw new Error(_prefix.concat(logMessage, ...a));
        }
        if (_logLevel === 'silent') {
            // anyways throw an error
            throw new Error(_prefix.concat(logMessage, ...a));
        }
    },

    success: (logMessage, ...a) => {
        _writeLogStorage('-SUCCESS- ', _prefix, logMessage, ...a);
        if (_logLevel === 'verbose') {
            console.green(_prefix, logMessage, ...a);
        }
    },

    /**
     * @param {String} Message
     */
    log: (logMessage, ...a) => {
        _writeLogStorage('-LOG- ', _prefix, logMessage, ...a);
        if (_logLevel === 'verbose') {
            console.default(_prefix, logMessage, ...a);
        }
    },

    /**
     * @param {String} Message
     */
    info: (logMessage, ...a) => {
        _writeLogStorage('-INFO- ', _prefix, logMessage, ...a);
        if (_logLevel === 'verbose') {
            console.blue(_prefix, logMessage, ...a);
        }
    },

    /**
     * @param {String} Message
     */
    warn: (logMessage, ...a) => {
        _writeLogStorage('-VERBOSE- ', _prefix, logMessage, ...a);
        if (_logLevel === 'verbose') {
            console.yellow(_prefix, logMessage, ...a);
        }
    }
};
