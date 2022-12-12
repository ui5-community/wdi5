// the cucumber framework uses the 'console' module which also modifies the console object.
// We need to import the console specifically otherwise we run into duplicate names and node
// will kill the whole processes.

const node14Up = parseInt(process.versions.node.substring(0, 2)) > 14
if (node14Up) {
    ;(async () => {
        global.console = await import("node:console")
    })()
}

const translate = (color) => {
    switch (color) {
        case "red":
            return "31"
        case "green":
            return "32"
        case "yellow":
            return "33"
        case "blue":
            return "34"
        case "magenta":
            return "35"
        case "cyan":
            return "36"
        case "default":
            return "0"
        default:
            return "32" // all is good
    }
}

export const colored =
    (color) =>
    (msg, ...other) =>
        typeof msg === "string"
            ? console.log(`\x1b[${translate(color)}m%s\x1b[0m`, msg, ...other)
            : console.log(msg, ...other)

const _ = {
    red: colored("red"),
    green: colored("green"),
    yellow: colored("yellow"),
    blue: colored("blue"),
    magenta: colored("magenta"),
    cyan: colored("cyan"),
    default: colored("default")
}
// we need to use a copy of the original object as 'coloredConsole' is a frozen object
export const chalk = Object.assign(console, { ..._ })
