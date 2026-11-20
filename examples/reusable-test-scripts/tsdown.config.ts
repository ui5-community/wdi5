import type { UserConfig } from "tsdown"
import { defineConfig } from "tsdown"

const sharedConfig: UserConfig = {
    entry: ["ui5-local-apps/**/*.ts", "ui5-remote-apps/**/*.ts"],
    root: "./",
    unbundle: true,
    dts: true,
    clean: true,
    deps: {
        neverBundle: true
    },
    outputOptions: {
        exports: "named"
    }
}

export default defineConfig([
    {
        ...sharedConfig,
        format: ["esm"],
        outDir: "dist/esm",
        outputOptions: {
            exports: "named",
            entryFileNames: "[name].js"
        }
    },
    {
        ...sharedConfig,
        format: ["cjs"],
        outDir: "dist/cjs"
    }
])
