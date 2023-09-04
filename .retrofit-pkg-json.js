// transmogrifying wdi5's package.json to a cjs version
import { promises as fs } from "fs"
import pkgJson from "./package.json" assert { type: "json" }
;["type", "exports", "types", "files", "workspaces", "scripts", "lint-staged"].forEach((section) => {
    delete pkgJson[section]
})
;(async () => {
    await fs.mkdir("./cjs", { recursive: true })
    await fs.writeFile("./cjs/package.json", JSON.stringify(pkgJson, null, 2))
})()
