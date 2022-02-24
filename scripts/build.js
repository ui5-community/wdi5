#!/usr/bin/env node

// this prepares workspace files for the to-be distributed npm module

const fs = require("fs/promises")

// clean up package.json
const pkgJson = require("../package.json")
delete pkgJson.workspaces
delete pkgJson.scripts
delete pkgJson.devDependencies
delete pkgJson["lint-staged"]

// copy
// - cleaned up package.json
// - browser command types
;(async () => {
    await Promise.all([
        fs.writeFile("dist/package.json", JSON.stringify(pkgJson)),
        fs.copyFile("src/types/browser-commands.d.ts", "dist/types/browser-commands.d.ts")
    ])
})()
