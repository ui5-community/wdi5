const { BeforeAll, Before, After, AfterAll, setDefaultTimeout } = require("@cucumber/cucumber")

const { env } = process
const fs = require("node:fs")
const os = require("node:os")

const gTimeout = env.CDS_CUCUMBER_DEBUG == "1" ? 60 * 60 : 60 * 10
setDefaultTimeout(gTimeout * 1000)

BeforeAll(async function () {
    env.CDS_CUCUMBER_TMPDIR = env.CDS_CUCUMBER_TMPDIR || os.tmpdir()
})

Before(async function () {
    this.allProcesses = []
})

After(async function () {
    if (this.controller) {
        if (env.SLOW_QUIT) await _sleep(1000 * parseInt(env.SLOW_QUIT))
        await this.controller.quit()
        this.controller = undefined
    }
    const terminateProcess = require("../terminateProcess")
    for (let process of this.allProcesses) {
        process.exitCode = -1
        if (process.pid == 0) continue
        let signal = process.signal || "SIGTERM"
        try {
            await terminateProcess(process.pid, signal)
        } catch (e) {
            console.log(`terminateProcess(${process.pid}, ${signal}) failed: ${e}`)
        }
        if (process.params.markFile && fs.existsSync(process.params.markFile)) {
            console.log("delete directory:", process.params.workingDirectory)
            try {
                fs.rmSync(process.params.workingDirectory, { recursive: true, force: true })
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log("skip deletion of directory:", process.params.workingDirectory)
        }
    }
    this.allProcesses = []
})

AfterAll(async function () {
    if (env.CDS_CUCUMBER_CODECOV) {
        const generateCodecovReport = require("../generateCodecovReport")
        await generateCodecovReport("tmp/coverage")
    }
})

function _sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}
