# Test Structure

## Overview

Tests across the example apps share a common set of test scripts that live in a single source of truth:

```
examples/reusable-test-scripts/ui5-local-apps/
```

These scripts are written in TypeScript and compiled to both **CJS** (`dist/cjs`) and **ESM** (`dist/esm`) so each example app can consume them in its native module format — without duplicating test logic.

### Example apps

| App                       | UI5 version | Module format | Test file extension | Port |
| ------------------------- | ----------- | ------------- | ------------------- | ---- |
| `examples/ui5-js-app`     | v1.\*       | CJS           | `.cjs`              | 8081 |
| `examples/ui5-v2-js-app`  | v2.\*       | ESM           | `.js`               | 8082 |
| `examples/ui5-ts-app-NEW` | v1.\*       | TypeScript    | `.ts`               | 8083 |

---

## Running tests

Each app exposes the same npm script interface.

### Build the reusable test scripts first

The shared test scripts must be compiled before any app can run them. From the repo root:

```shell
npm run build:ui5:tests
```

This removes any previous output and compiles the TypeScript sources to both targets:

- `examples/reusable-test-scripts/dist/cjs/` — for `ui5-js-app`
- `examples/reusable-test-scripts/dist/esm/` — for `ui5-v2-js-app`

`ui5-ts-app-NEW` consumes the sources directly, so no compiled output is needed for it.

> The build step is required once per checkout and after any change to files under `examples/reusable-test-scripts/`.

### Run all three apps from the repo root

The root `package.json` has dedicated entries that start the webserver and run the full test suite for each app:

| Root script               | App                       |
| ------------------------- | ------------------------- |
| `npm run test:ui5:app:v1` | `examples/ui5-js-app`     |
| `npm run test:ui5:app:v2` | `examples/ui5-v2-js-app`  |
| `npm run test:ui5:app:ts` | `examples/ui5-ts-app-NEW` |

These are equivalent to running `npm run start:test` inside the respective workspace.

### Start the app

```shell
npm run start -w ui5-js-app
```

This starts the UI5 local webserver (e.g. on port 8081). The equivalent commands apply to the other two apps.

### Run a single wdio configuration

Each app has `test:*` scripts for every wdio configuration:

| Script                | What it runs                                                 |
| --------------------- | ------------------------------------------------------------ |
| `test:webserver`      | Base wdio configuration, app served from the local webserver |
| `test:ui5tooling`     | App served via the UI5 tooling middleware                    |
| `test:lateInject`     | wdi5 service injected after the page loads                   |
| `test:multiremote`    | Multi-browser (multiremote) configuration                    |
| `test:urlDeprecation` | Validates deprecated URL-based configuration                 |

```shell
# run one configuration for ui5-js-app
npm run test:webserver -w ui5-js-app

# narrow to a single test file and keep the browser open
npm run test:webserver -w ui5-js-app -- --spec ./webapp/test/e2e/basic.test.cjs --watch
```

### Run all configurations in sequence

```shell
npm test -w ui5-js-app
```

This runs every `test:*` script one after another using `npm-run-all`.

### Start the app and run all tests in one command

```shell
npm run start:test -w ui5-js-app
```

The `start:test` script starts the webserver and the full test suite in parallel. The webserver is stopped automatically when the tests finish.

---

## Reusable test scripts

### Location

```
examples/reusable-test-scripts/ui5-local-apps/
```

All `.test.ts` files here are the **single source** consumed by all three apps. They are compiled to:

- `dist/cjs/` — consumed by `ui5-js-app` (CJS, `.test.cjs`)
- `dist/esm/` — consumed by `ui5-v2-js-app` (ESM, `.test.js`)
- directly as TypeScript — consumed by `ui5-ts-app-NEW` (`.test.ts`)

### Test files

## wdio configurations

Each app contains its wdio configuration files under `webapp/test/`. The configuration hierarchy is:

```
examples/wdio.root-base.conf.cjs        ← shared root: browser caps, timeouts, wdi5 service
  └── webapp/test/wdio.base.conf.*      ← per-app base: baseUrl, port, path to compiled test scripts
        └── webapp/test/wdio-*.conf.*   ← per-scenario config: specs, excludes, overrides
```

### Root base config

`examples/wdio.root-base.conf.cjs` is the single source of truth for settings shared across all apps: Chrome capabilities, `--headless`/`--debug` flag handling, timeouts, the `ui5` service, and the Mocha framework. It exports a `baseConfig` object.

Every app's `wdio.base.conf.*` must import and spread it:

```js
// CJS (ui5-js-app)
const { baseConfig: rootBaseConfig } = require("../../../wdio.root-base.conf.cjs")
exports.baseConfig = { ...rootBaseConfig, baseUrl: "http://localhost:8081/index.html" }

// ESM (ui5-v2-js-app / ui5-ts-app-NEW)
import { baseConfig as rootBaseConfig } from "../../../wdio.root-base.conf.cjs"
export const baseConfig = { ...rootBaseConfig, baseUrl: "http://localhost:8083/index.html" }
```

Individual scenario configs then spread the app's `baseConfig` and add only what differs (specs, excludes, additional services, etc.).

### TypeScript config inheritance

Apps that use TypeScript for their test configs must extend `examples/tsconfig.json`, which itself extends the repo root `tsconfig.json`. The per-app `tsconfig.json` should set only the values specific to that app (e.g. `rootDir`, `outDir`, type references):

```json
{
  "extends": "../../examples/tsconfig.json",
  "compilerOptions": {
    "rootDir": "./webapp",
    "outDir": "./dist"
  }
}
```

Do not copy common compiler options into the per-app tsconfig — keep the inheritance chain intact so changes to shared settings propagate everywhere.

### Config files

| Config file                  | Purpose                                                      |
| ---------------------------- | ------------------------------------------------------------ |
| `wdio.base.conf.*`           | Per-app base: `baseUrl`, port, path to compiled test scripts |
| `wdio-webserver.conf.*`      | App served from the local UI5 webserver                      |
| `wdio-ui5tooling.conf.*`     | App served via the UI5 tooling middleware                    |
| `wdio-ui5-late.conf.*`       | wdi5 service injected after the page loads                   |
| `wdio-multiremote.conf.*`    | Multi-browser (multiremote) session                          |
| `wdi5-urlDeprecation.conf.*` | Validates deprecated URL-based wdi5 configuration            |

The file extension matches the app's module format: `.cjs` for `ui5-js-app`, `.js` for `ui5-v2-js-app`, and `.ts` for `ui5-ts-app-NEW`.
