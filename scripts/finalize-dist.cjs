// The package root declares "type": "module" (for the ESM build's own .js files
// to be parsed correctly), but dist/cjs/*.js is emitted as CommonJS by
// tsconfig-cjs.json. Without a dist/cjs/package.json override, Node resolves
// dist/cjs/*.js against the root's "type": "module" and any require() of this
// package throws "ReferenceError: exports is not defined in ES module scope".
// Write the two marker files so each build output is parsed with the module
// system it's actually written in.
const fs = require("fs")
const path = require("path")

function writeTypeMarker(dir, type) {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ type }, null, 2) + "\n")
}

writeTypeMarker(path.join(__dirname, "..", "dist", "cjs"), "commonjs")
writeTypeMarker(path.join(__dirname, "..", "dist", "esm"), "module")
