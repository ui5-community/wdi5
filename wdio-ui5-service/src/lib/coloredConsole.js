const translate = (color) => {
    switch (color) {
        case 'red':
            return '31';
        case 'green':
            return '32';
        case 'yellow':
            return '33';
        case 'blue':
            return '34';
        case 'magenta':
            return '35';
        case 'cyan':
            return '36';
        case 'default':
            return '0';
        default:
            return '32'; // all is good
    }
};

const colored =
    (color) =>
    (msg, ...other) =>
        typeof msg === 'string'
            ? console.log(`\x1b[${translate(color)}m%s\x1b[0m`, msg, ...other)
            : console.log(msg, ...other);

const _ = {};
['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'default'].forEach((color) => (_[color] = colored(color)));

module.exports = Object.assign(console, _);
