const { exec, execSync } = require("child_process")

exec("npm -v", function (error, stdout, stderr) {
    "use strict"
    if (error) {
        console.error("error: " + error + " " + stderr)
        return
    }

    let sReqNpmVersion = process.env.npm_package_engines_npm
    const npmVersion = parseFloat(stdout)

    sReqNpmVersion = sReqNpmVersion.replace("<", "")
    sReqNpmVersion = sReqNpmVersion.replace("=", "")
    sReqNpmVersion = sReqNpmVersion.replace(">", "")
    const fReqNpmVersion = parseFloat(sReqNpmVersion)

    if (fReqNpmVersion > npmVersion) {
        console.info(
            `updating npm version from ${npmVersion} to the latest version because required npm version in package.json is set to ${sReqNpmVersion}`
        )
        execSync("npm install -g npm@latest")
        // not needed to execute npm install again due to the usage of this script in prepare hook
        // execSync("npm install")
    } else {
        // not needed to execute npm install again due to the usage of this script in prepare hook -> do nothing
        // execSync("npm install")
    }
})
