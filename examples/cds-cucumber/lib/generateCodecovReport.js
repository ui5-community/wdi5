async function report(dir) {
    return new Promise(function (resolve, reject) {
        const { spawn } = require("node:child_process")
        let command = "sh"
        let args = ["-c", `npx c8 report -o ${dir} --exclude-node-modules false -r html`]
        let p = spawn(command, args)

        p.stdout.on("data", function (data) {
            console.log(data.toString())
        })

        p.stderr.on("data", function (data) {
            console.log(data.toString())
        })

        p.on("error", (error) => {
            reject(error)
        })

        p.on("exit", (code) => {
            if (code == 0) resolve(code)
            else reject(code)
        })
    })
}

if (require.main == module)
    (async function () {
        await report()
    })()
else module.exports = report
