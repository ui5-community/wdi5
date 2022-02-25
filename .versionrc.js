// .versionrc.js
module.exports = {
    bumpFiles: [
        {
            filename: "package.json",
            type: "json"
        },
        {
            filename: "dist/package.json",
            type: "json"
        }
    ],
    scripts: {
        posttag: "copyfiles CHANGELOG.md dist/"
    }
}
