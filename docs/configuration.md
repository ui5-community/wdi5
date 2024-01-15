# Configuring `wdi5`

?> Please note that as a prerequisite, some webserver-capable tooling (such as the [ui5-tooling](https://sap.github.io/ui5-tooling/)) is needed to run both the UI5 app and the `wdi5/wdio` tests.

With `wdi5` being an extension ("service") to WebdriverIO (`wdio`), first and foremost [all configuration options of `wdio`](https://v7.webdriver.io/docs/options) can also be used in `wdi5`! They all go into the same configuration file, per default `wdio.conf.js` (for JavaScript) and `wdio.conf.ts` (for TypeScript).

Of course the configuration file name can be changed arbitrarily. But then it needs to be specified explicitly when [running `wdi5`/`wdio`](running), e.g. `$> wdio run myconfig.js`.

?> `wdi5` can be used both in a [CJS-](https://nodejs.org/docs/latest/api/modules.html) and an [ESM-](https://nodejs.org/docs/latest/api/esm.html)environment. The code examples sometimes use either or, but in no favor of one over the other.

## `wdi5`

All options go into a top-level `wdi5` object in `wdio.conf.(j|t)s`,
with the exception of the `baseUrl` pointing to the `index.html` of your UI5 app.

?> Do not account for redirects etc. (think application router), `wdi5` wants to be pointed directly to where UI5 is being bootstrapped.

```javascript
exports.config = {
  //...
  baseUrl: "http://localhost:8080/index.html", // [mandatory] {string}, URL to your running UI5 app
  // ...
  wdi5: {
    screenshotPath: require("path").join("some", "dir", "for", "screenshots"), // [optional] {string}, default: ""
    screenshotsDisabled: false, // [optional] {boolean}, default: false; if set to true, screenshots won't be taken and not written to file system
    logLevel: "verbose", // [optional] error | verbose | silent, default: "error"
    skipInjectUI5OnStart: false, // [optional] {boolean}, default: false; true when UI5 is not on the start page, you need to later call <wdioUI5service>.injectUI5() manually
    waitForUI5Timeout: 15000, // [optional] {number}, default: 15000; maximum waiting time in milliseconds while checking for UI5 availability
    btpWorkZoneEnablement: false, // [optional] {boolean}, default: false; whether to instruct wdi5 to inject itself in both the SAP Build Workzone, standard edition, shell and app
    ignoreAutoWaitUrls: [] // [optional] {string[]}, default: []; Array of regex to ignore certain XHR/Fetch calls wile autowaiting
  }
  // ...
}
```

!> as of `wdi5` `1.0`, the `url` config property is deprecated. Please provide the full FQDN in the regular `baseUrl` configuration option.

### `screenshotPath`

A string pointing to a directory, relative to the location of the `wdio.conf.(j|t)s` configuration file.
In case your UI5 app lives in `/app` with a files system structure similar to ...

```shell
app
├── package-lock.json
├── package.json
├── src
├── tsconfig.json
├── ui5.yaml
├── wdio.conf.ts
├── webapp
└── xs-app.json
```

... the `screenshotPath` in `wdio.conf.ts` could be `webapp/test/screenshots`.

?> make sure the `screenshotPath` directory exists at runtime

### `screenshotsDisabled`

Boolean (default: `false`) to turn screenshotting on or off, e.g. in a local dev environment vs a CI run.

### `logLevel`

Any of `"verbose"`, `"error"` or `"silent"`. Default: `verbose`.
`wdi5` comes with its own minimal console-logger. It helps in monitoring what the "ui5" service is currently executing in the WebdriverIO context.
Additionally, it can be used in tests via a static `getter` on the `wdi5`-object provided by `wdio-ui5-service`:

```javascript
const { wdi5 } = require("wdio-ui5-service")
const Logger = wdi5.getLogger()
Logger.info("...")
```

### `url` (deprecated!)

As of `wdi5` `1.0`, the `wdi5`-specific `url` property was deprecated in favor of the regular and [always mandatory `baseUrl`](https://webdriver.io/docs/options/#baseurl).

Example for `ui5-tooling`-based webservers:

```diff
-   wdi5: {
-       url: "index.html"
-   },
-   baseUrl: "http://localhost:8080"
+   baseUrl: "http://localhost:8080/index.html"
```

Example for standard webservers:

```diff
-   wdi5: {
-       url: "#"
-   },
    baseUrl: "http://localhost:8888"
```

User feedback was that two URL-related setting were rather confusing. Deprecating `wdi5`'s `url` config parameter avoids that and also reduces config effort.

?> There's a legacy fallback in place so that `wdi5`'s `url` configuration option will continue to work, albeit receive a deprecation warning in the console log.

~~A string denoting the "directory index" aka HTML-file containing the UI5 bootstrap code.~~

~~When using the [ui5-tooling](https://sap.github.io/ui5-tooling/) for serving your UI5 app, `url` needs to point to the HTML file containing the `<script id="sap-ui-bootstrap" ...>` tag for referencing UI5 core.~~

~~In a webserver-like scenario, this might be the empty string `""`! ~~
~~Reason being is that many webservers reroute incoming traffic to a domain (e.g. `https://example.org)` default to a directory index file, generally `index.html` (e.g. `https://example.org/index.html`) - but the user never sees that index file as part of the url in the browser bar. ~~
~~As `wdi5`/`wdio` operates the browser "as a user would", it doesn't "see" that "directory index" redirect, and providing it with `url: ""` in the config caters to that.~~

### `skipInjectUI5OnStart`

Boolean (default: `false`) to delay the injection of `wdi5` at runtime.

Use case is if your test scenario starts on pages where no UI5 is present. Then WebdriverIO can do all the work, up to when the test reaches a UI5 page. Then late-injecting `wdi5` works like:

```javascript
const { default: _ui5Service } = require("wdio-ui5-service")
const ui5Service = new _ui5Service()

// later in a test step:
await ui5Service.injectUI5()
```

See <https://github.com/ui5-community/wdi5/tree/main/examples/ui5-js-app/webapp/test/e2e/ui5-late.test.js> for a complete example.

### `waitForUI5Timeout`

Number in milliseconds (default: `15000`) to wait for UI5-related operations within a UI5 app. This is the equivalent to OPA5's [`waitFor()` option `timeout`](https://ui5.sap.com/sdk/#/api/sap.ui.test.Opa5/methods/waitFor).

?> Setting this timeout to 30 seconds or higher requires the [session script timeout](https://webdriver.io/docs/timeouts/#session-script-timeout) to be increased as well.

### `btpWorkZoneEnablement`

Boolean setting to trigger injecting `wdi5` into both the shell and the app when used with the SAP Build Workzone, standard edition.  
Recommended complement is to also [configure IAS Authentication](authentication?id=sap-cloud-identity-services-identity-authentication): as SAP Build requires its own Identity Provider (most likely provided by using an IAS tenant), you'll have to configure authentication against that as well in `wdi5`.

### `ignoreAutoWaitUrls`

Array of URLs (as strings), either relative or absolute. `RegEx` are supported.   
Querying the URLs will be excluded from the UI5 lifecycle sync. Meaning: no Test code will wait until querying the URLs resolve. 
Typical use case is "longpolling" requests that continuously update your app.

!> Be careful not to add too many URLs here as this might make the tests unreliable

## `package.json`

Not required, but as a convention, put a `test` or `wdi5` script into your UI5.app's `package.json` to start `wdi5/wdio`.

```json
{
  "name": "ui5-app",
  // ...
  "scripts": {
    // ...
    "test": "wdio run wdio.conf.js --headless",
    "wdi5": "wdio run wdio.conf.js"
    // ...
  },
  "devDependencies": {
    // ...
    "wdio-ui5-service": "*"
  }
  // ...
}
```
