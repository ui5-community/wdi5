const { spawn } = require("node:child_process")
const path = require("node:path")
const isWindowsOS = path.sep === "\\"

function terminateProcess(pid, signal) {
    if (isWindowsOS) return terminateProcessWin(pid)
    return new Promise((resolve, reject) => {
        const command = "ps"
        const args = ["-eo", "pid,ppid,args"]
        const options = {}

        let p = spawn(command, args, options)
        let result = ""

        p.stdout.on("data", (data) => {
            result += data.toString()
        })

        p.on("exit", (code) => {
            if (code == 0) {
                ;(async function () {
                    try {
                        await findAndTerminate(result, pid, signal)
                        resolve(code)
                    } catch (e) {
                        reject(e)
                    }
                })()
            } else reject(code)
        })
    })
}

async function findAndTerminate(data, PID, signal) {
    let lines = data.toString().split("\n")
    let re = /(\d+)\s+(\d+)\s+(.+)/
    let commands = {}
    let processChildrenMap = {}
    let childrenMap = {}
    lines
        .map((l) => l.match(re))
        .filter((l) => !!l)
        .forEach((p) => {
            let pid = parseInt(p[1])
            let ppid = parseInt(p[2])
            if (!processChildrenMap[ppid]) processChildrenMap[ppid] = []
            processChildrenMap[ppid].push(pid)
            childrenMap[pid] = ppid
            commands[pid] = p[3]
        })

    let errors = []
    let terminated = false
    for (let p of Object.keys(commands)) {
        let command = commands[p]
        if (p == PID) {
            if (command.startsWith("node ") && command.endsWith("/cds-serve"))
                try {
                    await terminate(p, signal)
                    terminated = true
                } catch (e) {
                    errors.push(`terminateProcess.js: failed to send signal ${signal} to process ${child}`)
                }
        }
    }
    if (!terminated)
        for (let p of Object.keys(processChildrenMap)) {
            let children = processChildrenMap[p]
            if (!children) continue
            for (let child of children) {
                if (!processChildrenMap[child]) {
                    if (hasParent(child, PID)) {
                        try {
                            await terminate(child, signal)
                            terminated = true
                        } catch (e) {
                            errors.push(`terminateProcess.js: failed to send signal ${signal} to process ${child}`)
                        }
                    }
                }
            }
        }
    if (errors.length > 0) throw errors
    if (!terminated) throw Error("not found")

    function hasParent(pid, ppid) {
        if (!childrenMap[pid]) return false
        if (childrenMap[pid] == ppid) return true
        return hasParent(childrenMap[pid], ppid)
    }

    function terminate(pid, signal) {
        return new Promise((resolve, reject) => {
            console.log(`terminateProcess.js: kill -s ${signal} ${pid}`)
            let p = spawn("kill", ["-s", signal, pid], {})
            p.on("exit", (code) => {
                if (code === 0) resolve(code)
                else reject(code)
            })
        })
    }
}

function terminateProcessWin(pid) {
    return new Promise((resolve, reject) => {
        const command = "taskkill"
        const args = ["/pid", pid, "/t", "/f"]
        const options = {}

        let p = spawn(command, args, options)

        p.on("exit", (code) => {
            if (code == 1) resolve(code)
            else reject(code)
        })
    })
}

if (require.main == module) {
    ;(async function () {
        let { argv } = process
        let pid = argv[2]
        if (!pid) throw Error("No PID specified")
        try {
            await terminateProcess(parseInt(pid), "SIGTERM")
        } catch (error) {
            throw Error(`Failed to terminate process with pid ${pid}, error: ${error}`)
        }
    })()
} else {
    module.exports = terminateProcess
}
