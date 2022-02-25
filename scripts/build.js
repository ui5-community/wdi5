#!/usr/bin/env node

// this prepares workspace files for the to-be distributed npm module
const fs = require("fs/promises")
const { join } = require("path")

// clean up package.json
const pkgJson = require("../package.json")
delete pkgJson.workspaces
delete pkgJson.scripts
delete pkgJson.devDependencies
delete pkgJson["lint-staged"]
pkgJson.main = "node-rt/index.js"

// minify client side js files
const { minify } = require("terser")
// config for how Terser should minify the code
const config = {
    compress: {
        dead_code: true,
        drop_console: false,
        drop_debugger: true,
        keep_classnames: false,
        keep_fargs: true,
        keep_fnames: false,
        keep_infinity: false
    },
    mangle: {
        eval: false,
        keep_classnames: false,
        keep_fnames: false,
        toplevel: false,
        safari10: false
    },
    module: false,
    sourceMap: false,
    output: {
        comments: false
    }
}
const sourceDir = "client-side-js"
const targetDir = "dist"

// - copy cleaned up package.json
// - minify client side js
;(async () => {
    await fs.mkdir(join(targetDir, sourceDir), { recursive: true })
    // prep for max parallel async
    const _filesToMinify = await fs.readdir(sourceDir)
    const filesToMinify = _filesToMinify.map((file) => {
        console.log(`minifying ${file}`)
        return fs
            .readFile(join(sourceDir, file), "utf8")
            .then((code) => {
                return minify(code, config)
            })
            .then((minified) => {
                fs.writeFile(join(targetDir, sourceDir, file), minified.code)
            })
    })

    await Promise.all([
        fs.writeFile("dist/package.json", JSON.stringify(pkgJson)),
        ...filesToMinify,
        fs.copyFile("LICENSE", "dist/LICENSE")
        // changelog is put into /dist after standard-version run by lifecycle hook, see .versionrc.js
    ])
})()
