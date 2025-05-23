import tseslint from "typescript-eslint"
import js from "@eslint/js"
import { configs as wdioConfigs } from "eslint-plugin-wdio"
import mochaPlugin from "eslint-plugin-mocha"

export default tseslint.config([
    {
        ignores: ["esm/", "cjs/", "dist/", "node_modules/", "docker/", "docs/", "examples/"]
    },
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module"
        },
        extends: [tseslint.configs.recommended, js.configs.recommended],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/ban-ts-comment": "warn"
        }
    },
    {
        files: ["test/**/*"],
        extends: [wdioConfigs["flat/recommended"], mochaPlugin.configs.recommended]
    },
    {
        files: ["client-side-js/**/*"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs"
        }
    }
])
