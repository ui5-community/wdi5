import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"
import js from "@eslint/js"
import { configs as wdioConfigs } from "eslint-plugin-wdio"
import mochaPlugin from "eslint-plugin-mocha"

export default defineConfig([
    {
        ignores: [
            "esm/",
            "cjs/",
            "dist/",
            "node_modules/",
            "docs/",
            "examples/*",
            "examples/reusable-test-scripts/dist/"
            // "!examples/reusable-test-scripts/"
        ]
    },
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node
            }
        },
        extends: [tseslint.configs.recommended, js.configs.recommended, tseslint.configs.strict],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/ban-ts-comment": "warn",
            "no-console": "error"
        }
    },
    {
        files: ["examples/reusable-test-scripts/**/*"],
        extends: [wdioConfigs["flat/recommended"], mochaPlugin.configs.recommended],
        rules: {
            "mocha/no-mocha-arrows": "off"
        }
    },
    {
        files: ["commitlint.config.cjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                ...globals.browser,
                sap: "readonly"
            }
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off"
        }
    }
])
