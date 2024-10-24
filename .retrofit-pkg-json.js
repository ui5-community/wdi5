// transmogrifying wdi5's package.json to a cjs version
import { promises as fs } from "fs"
import { readFileSync } from "fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const pkgJsonPath = join(dirname(fileURLToPath(import.meta.url)), "./package.json")
const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"))

;["type", "exports", "types", "files", "workspaces", "scripts", "lint-staged"].forEach((section) => {
    delete pkgJson[section]
})
;(async () => {
    await fs.mkdir("./cjs", { recursive: true })
    await fs.writeFile("./cjs/package.json", JSON.stringify(pkgJson, null, 2))
})()
