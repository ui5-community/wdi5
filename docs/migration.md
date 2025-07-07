# Migrate from a previous version

## from `^2` to `^3`

Version >= 3 of `wdi5` is WebdriverIO v9 compatible.

Major, potentially breaking, changes:

- [`BiDi`](https://developer.chrome.com/blog/webdriver-bidi) is the default automation protocol now. If you want to continue using `Webdriver`, use `'wdio:enforceWebDriverClassic': true` in your `wdio`/`wdi5` config file.  
  Find config examples in:
  - `examples/ui5-ts-app/test/e2e/protocol/wdio-ui5-webdriver.conf.ts`
  - `examples/ui5-js-app/e2e-test-config/wdio.base.conf.js`
- deprecation of `devtools` protocol: it is no more included in Webdriver.IO and thus also not available in `wdi5`. Yet `BiDi` should be a drop-in replacement for it, without the need for changing config files or rewrite tests.

Notable changes:

- the [client-side JS](https://github.com/ui5-community/wdi5/tree/v9-support/src/client-side-js) is now typed and delivered as parts of both the `ESM` and `CJS` module
- Support for basic auth remains as is in `wdi5` - but as of `wdio^9`, [there's now an additional way of reaching `basic auth`-protected apps](https://webdriver.io/blog/2024/08/15/webdriverio-v9-release/#overcome-basic-authentification) via `browser.url`(_note:_ with the BiDi protocol only! (as of July 2025))
- support for Node 16 + 18 is officially dropped from `wdi5`

## from `^1` to `^2`

Version >= 2 < 3 of `wdi5` is WebdriverIO v8 compatible. This means that the primary module has moved to ESM, but CJS compatibility is still ensured.

### no more explicit browser driver needed!

WebdriverIO now automates downloading and starting the appropriate driver corresponding to the `browser` specified in the `capabilites` section of the config file (see also [Take a seat, WebdriverIO is driving for you!](https://webdriver.io/blog/2023/07/31/driver-management) ):

```diff
- services: ["chromedriver", "ui5"],
+ services: ["ui5"],
 //...
 capabilities: [{
    browserName: "chrome"
 }]
```

Setting `broswerName: "chrome"` is enough to tell `wdi5`/`wdio` to run the tests with the stable version of Chrome - no more `"chromedriver"` needed in the `services`!  
To switch to Safari on macOS, following the above example is as easy as changing the `browserName`:

```js
// wdio.conf.js
  services: ["ui5"],
  //...
  capabilities: [{
     browserName: "safari"
  }]
```

?> this is an _optional_ change - `wdi5` will continue to work also with explicitly denoting the browser driver in `services`!

### check file system location reference of spec files in `wdio.config.(j|t)s`

directory references start from the directory the config file is in now, not from `cwd` or project root:

**Example**: `wdi5` config file is located adjacent to `webapp`:

```console
.
├── e2e-test-config
│   └── wdi5.conf.js
# ...
└── webapp
    ├── test
    │   └── e2e
    │       ├── aggregation.test.js
    │       ├── allControls.test.js
    │       ├── allControlsForce.test.js
    │       ├── basic.test.js
# ...
```

Config file change:

```diff
const config = {
- specs: [join("webapp", "test", "e2e", "ui5-late.test.js")],
+ specs: [join("..", "webapp", "test", "e2e", "ui5-late.test.js")],
  // ...
}
```

**Example**: `wdi5` config file is located in the same directory as the tests:

```console
.
├── regular-journey.test.ts
├── testlib-journey.test.ts
└── wdio.conf.ts
```

Config file change:

```diff
export const config: wdi5Config = {
- specs: ["./test/e2e/workzone/*.test.ts"],
+ specs: ["./*.test.ts"],
  // ...
}
```

### usage of devtools automation protocol

Now requires using the `devtools` package (which is now a dependency of `wdi5`) and explicit configuration in the `*.conf.(j|t)s`-file:

```diff
 export const config: wdi5Config = {
     baseUrl: "https://your-app",
     services: ["ui5"],
     specs: [resolve("test/e2e/Protocol.test.ts")],
+    automationProtocol: "devtools",
     capabilities: [
      {
        //...
      }
     ]
 }
```

### use `wdi5` as ESM module

With `wdi5` v2, it is possible to write tests in an ESM module environment (see [/examples/ui5-js-app-esm](https://github.com/ui5-community/wdi5/blob/main/examples/ui5-js-app-esm)). The `describe` and `it` syntax remains the same as in an CJS environment. The major difference is in the way `wdi5` and third party modules are imported in ESM-style JavaScript files.

Sample excerpt:

```js
// file: basic.test.js
import { wdi5 } from "wdio-ui5-service" // <--

describe("...", () => {
    it("...", () => {
        await browser.asControl(selector).someMethod()
        wdi5.getLogger("esm!").log("Hello ESM World!")
    })
})

```
