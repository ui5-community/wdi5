const { spawn } = require("node:child_process")
const { env, cwd } = require("node:process")
const path = require("node:path")
const fs = require("node:fs")
const os = require("node:os")
const isUnixOS = path.sep === "/"
const isWindowsOS = path.sep === "\\"
const npx = isUnixOS ? "npx" : "npx.cmd"

async function startProcess(params = {}) {
    params.stack = env.CDS_STACK || params.stack || "node"
    let directory = env.CDS_SERVICE_DIRECTORY || params.directory
    let application = env.CDS_SERVICE_APPLICATION || params.application
    if (env.REMOTE_PORT) {
        params = Object.assign(params, createWorkingDirectory())
        return { pid: 0, params }
    }
    let rootdir = cwd()
    console.log("rootdir", rootdir)
    let appdir = directory ? path.join(rootdir, directory) : rootdir
    if (application) appdir = path.join(appdir, application)
    console.log("appdir", appdir)
    let port = env.CDS_SERVICE_PORT || 0
    let isJava = params.stack === "java"

    let command
    let args
    let options = { cwd: appdir }

    if (isJava) {
        command = "mvn"
        args = ["clean", "spring-boot:run"]
    } else {
        command = npx
        args = [env.CDS_COMMAND || "cds-serve"]
    }
    for (let i = 1; i <= 9; i++) {
        let iarg = `CDS_COMMAND_ARG${i}`
        if (env[iarg]) args.push(env[iarg])
    }
    options.env = Object.assign({ PORT: port }, env)
    if (env.CDS_ENABLE_LOCAL_UI5_VERSION === "1")
        if (!env.CDS_CONFIG) options.env.CDS_CONFIG = `{"preview": {"ui5": { "host": "/" } } }`
    params = Object.assign(params, createWorkingDirectory())
    if (isUnixOS) options.env.HOME = params.workingDirectory
    else options.env.USERPROFILE = params.workingDirectory
    let libInfo = {}
    if (env.CDS_CUCUMBER_DEBUG === "1") libInfo = symlinkLibrary(options.cwd)
    let callCodeCoverageC8 = env.CDS_CUCUMBER_CODECOV === "c8"
    if (callCodeCoverageC8) {
        let c8 = findNodeExecutable("c8")
        let cds_serve = findNodeExecutable("cds-serve")
        args = args.filter((x) => x != "cds-serve")
        args = ["-c", `${c8} --clean false --report-dir ./tmp/coverage node ${cds_serve} ${args.join(" ")}`]
        command = "sh"
    }

    console.log("command:", command)
    console.log("args:", args)
    var cdsProcess = spawn(command, args, options)
    Object.assign(cdsProcess, libInfo)
    console.log("pid", cdsProcess.pid)
    cdsProcess.scriptOutput = ""

    if (cdsProcess.stdout) {
        cdsProcess.stdout.setEncoding("utf8")
        cdsProcess.stdout.on("data", function (data) {
            console.log(data)
            cdsProcess.scriptOutput += data.toString()
        })
    }

    if (cdsProcess.stderr) {
        cdsProcess.stderr.setEncoding("utf8")
        cdsProcess.stderr.on("data", function (data) {
            console.log(data)
            cdsProcess.scriptOutput += data.toString()
        })
    }

    cdsProcess.on("close", function (exitCode) {
        cdsProcess.exitCode = exitCode
    })

    cdsProcess.on("exit", function (exitCode) {
        cdsProcess.exitCode = exitCode
    })

    let lookupString
    if (isJava) lookupString = "Tomcat started on port(s)"
    else lookupString = "[cds] - launched at "
    let loops = 2000
    for (var i = 0; i < loops; i++) {
        if (cdsProcess.exitCode !== null) {
            throw Error(`Command '${command} ${args.join(" ")}' terminated with exit code ${cdsProcess.exitCode}!`)
        }
        process.stdout.write(".")
        await sleep(500)
        if (cdsProcess.scriptOutput.indexOf(lookupString) != -1) {
            process.stdout.write("\n")
            break
        }
        await sleep(100)
    }

    if (isJava) {
        let re = /Tomcat started on port\(s\)\: (\d*) \(http\)/
        let matched = cdsProcess.scriptOutput.match(re)
        cdsProcess.hostname = "localhost"
        cdsProcess.port = matched[1]
        cdsProcess.signal = "SIGTERM"
    } else {
        let re = /server listening on { url: \'http\:\/\/(.*):(.*)\'/
        let matched = cdsProcess.scriptOutput.match(re)
        cdsProcess.hostname = matched[1]
        cdsProcess.port = matched[2]
        cdsProcess.signal = callCodeCoverageC8 ? "SIGINT" : "SIGUSR2"
    }

    console.log(`Service url: http://${cdsProcess.hostname}:${cdsProcess.port}`)
    cdsProcess.params = Object.assign({}, params)
    return cdsProcess
}

function symlinkLibrary(cwd) {
    let R = {}
    R.libUrl = env.CDS_CUCUMBER_LIB_URL
    if (!R.libUrl) {
        R.libFileName = env.CDS_CUCUMBER_LIB_FILE_NAME || "browser.js"
        R.libUrl = "/" + R.libFileName
        // locate or symlink browser.js in <service-root-dir>/app directory
        let browserJs = path.join(cwd, "app", R.libFileName)
        var _browserJs = path.join(path.dirname(__filename), "browser.js")
        R.libFile = browserJs
        if (!fs.existsSync(browserJs)) {
            console.log("create symlink", browserJs)
            console.log("  to", _browserJs)
            fs.symlinkSync(_browserJs, browserJs)
        } else {
            console.log("using symlink", browserJs)
        }
        return R
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

function createWorkingDirectory() {
    let date = new Date().toISOString().replaceAll(".", "_").replaceAll(":", "_").replaceAll("-", "_")
    let tmpdir = isUnixOS
        ? path.join(env.CDS_CUCUMBER_TMPDIR, `cds_cucumber_${os.userInfo().username}`, `${process.pid}_${date}`)
        : path.join(env.CDS_CUCUMBER_TMPDIR, `cds_cucumber_${os.userInfo().username}_${process.pid}_${date}`)
    let workingDirectory = env.CDS_CUCUMBER_WORKING_DIRECTORY || tmpdir
    if (!fs.existsSync(workingDirectory)) {
        console.log("Created temporary directory:", workingDirectory)
        fs.mkdirSync(workingDirectory, { recursive: true })
    }
    if (isWindowsOS) {
        let homedirRegistryFile = path.join(os.homedir(), ".cds-services.json")
        if (fs.existsSync(homedirRegistryFile)) {
            console.log("delete", homedirRegistryFile)
            fs.unlinkSync(homedirRegistryFile)
        }
    }
    const registryFile = path.join(workingDirectory, ".cds-services.json")
    if (!fs.existsSync(registryFile + ".lock")) {
        if (fs.existsSync(registryFile)) {
            console.log("delete", registryFile)
            fs.unlinkSync(registryFile)
        }
    } else {
        console.log("keep", registryFile)
    }
    const markFile = path.join(workingDirectory, ".cds.cucumber")
    if (!fs.existsSync(markFile)) {
        fs.writeFileSync(markFile, new Date().toString())
    }
    return { workingDirectory, markFile }
}

function findNodeExecutable(prog) {
    let dir = cwd()
    do {
        let p = path.join(dir, "node_modules", ".bin", prog)
        if (fs.existsSync(p)) return p
        dir = path.dirname(dir)
    } while (dir !== "/")
    throw new Error(`'Executable not found: ${prog}`)
}

module.exports = startProcess
