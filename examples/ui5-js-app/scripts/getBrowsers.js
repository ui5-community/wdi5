/**
 * analyse browser arguments
 */
exports.getBrowsers = function () {
    const availableBrowsers = ["chrome", "safari", "edge", "firefox"]
    const argv = process.argv
    let browsers = []
    const _browsers = argv.indexOf("--browsers")

    if (_browsers > -1) {
        // contain browsers
        // slice all params before
        const myArgs = process.argv.slice(_browsers + 1)

        browsers = myArgs.filter(function (element) {
            return availableBrowsers.includes(element)
        })

        console.log(`BROWSERS: ${browsers}`)
        return browsers
    }
    // browsers not set return all
    console.log(`BROWSERS: ${availableBrowsers}`)
    return availableBrowsers
}
