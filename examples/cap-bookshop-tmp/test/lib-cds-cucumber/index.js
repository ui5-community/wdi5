// require steps
const steps = require.resolve("./steps")
const fs = require("node:fs")
const path = require("node:path")

loadDir(path.dirname(steps))

function loadDir(dir) {
    const files = fs.readdirSync(dir)
    files.forEach((F) => {
        let fn = path.join(dir, F)
        if (fs.lstatSync(fn).isDirectory()) return loadDir(fn)
        if (!F.endsWith(".js")) return
        require(fn)
    })
}
