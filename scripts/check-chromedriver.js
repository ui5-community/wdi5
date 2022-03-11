const { exec, execSync } = require("child_process")

// mac
exec("'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --version", (err, stdout, stderr) => {
    if (err) {
        console.error(`[ERROR]: ${err} ${stderr}`)
        return
    }

    let pjson = require("../package.json")
    const sChromeVersion = stdout
    const iChromeVersion = parseInt(sChromeVersion.substring(14, 16))
    let sChromedriverVersion = pjson.devDependencies?.chromedriver
    const iChromedriverVersion = parseInt(sChromedriverVersion.substring(1, 3))

    console.log(`chromedriver version in devDependencies: ${iChromedriverVersion}`)
    console.log(`current installed chrome version is: ${iChromeVersion}`)

    if (iChromeVersion > iChromedriverVersion) {
        execSync("npm i chromedriver@latest")

        delete require.cache[require.resolve("../package.json")]
        pjson = require("../package.json")
        sChromedriverVersion = pjson.devDependencies?.chromedriver
        console.log(`chromedriver updated and saved in devDepedencies with: ${sChromedriverVersion}`)
    } else {
        console.log("chromedriver already up-to-date")
    }
})
