# `wdi5`: advanced usage and configuration

On a general note, we like to always have all parts of the test-environment running in parallel:

- manually started simulator/emulator
- `appium` e.g. via `npm run _startApp:ios` (except for Android, see below)
- test execution, e.g. `npm run _test:ios`

You can combine all of the above by running `npm run test:ios`, e.g. in a ci environment, at the cost of losing the flexibility of each tooling.

## Cordova plugins

This framework comes with a set of plugin mocks.

List of provided plugin mocks:

- phonegap-plugin-barcodescanner

To add a new cordova plugin mock, specify a `plugins` object in the `wdi5` object of the config file. Name it _exactly_ as the cordova plugin is named (e.g. "phonegap-plugin-barcodescanner") and use the `path` property to point to your mock implementation file. Additionally, you can define custom properties for programmatic "responses" during test execution (here: `mockedPluginResponse`).

```javascript
plugins: {
        'phonegap-plugin-barcodescanner': {
            path: "./to/mock/implementation.js",
            mockedPluginResponse: {
                text: '123123',
                format: 'EAN',
                cancelled: ''
            }
        },
        'other-cordova-plugin': {
            path: "./other/mock/implementation/path.js"
        }
    }
```

Check the `Cordova Plugin Mock Development` section under `How it works` in this documentation for further information.

### iOS

- install `appium` and all prerequisites mentioned in <http://appium.io/docs/en/drivers/ios-xcuitest/index.html> for `XCUITest`-based testing

- adjust basic config to use `appium` (see `tests/wdio-shared.config.js` for an example)

    ```javascript
    config = {
        // 4723 is the default port for Appium
        port: 4723,

        // let appium-driver take care of the mapping
        // path: '/'

        services: [
            [ 'appium' ]
        ]
    }
    ```

- enhance configuration with iOS-specific settings (see `tests/wdio-ios.config.js` for an example):

    ```javascript
    wdi5: {
        platform: 'ios'
    },
    capabilities = [
        {
            automationName: 'XCUITest',
            platformName: 'iOS',

            // iOS system
            platformVersion: '13.4',

            // For iOS, this must exactly match the device name as seen in Xcode.
            deviceName: 'iPhone SE (2nd generation)',

            // .ipa or .app file
            app: 'test/ui5-app/app/platforms/ios/build/emulator/UI5.app',

            // By default, Appium runs tests in the native context.
            // By setting autoWebview to true,
            // it runs our tests in the cordova context.
            autoWebview: true,

            // When set to true, it will not show permission dialogs,
            // but instead grant all permissions automatically.
            autoGrantPermissions: true,

            // display iOS simultator window
            isHeadless: false
        }
    ]
    ```

    refer to the [xcuitest-driver capabilities documentation](https://github.com/appium/appium-xcuitest-driver##desired-capabilities) for a complete list of possible settings

- `appium` may be started as a standalone service prior to the tests starting, but doesn't have to.
  if not started separately, `webdriver.io` will start it "under the hood" automatically.

    ```shell
    $> appium
    [Appium] Welcome to Appium v1.17.1
    [Appium] Appium REST http interface listener started on 0.0.0.0:4723

    $> npx wdio wdio-ios.conf.js

    Execution of 5 spec files started at ...
    ...
    ```

    there's example `npm scripts` available for the above in `/package.json`

#### iOS Permissions

To manually set permissions for your application under test like file access or notifications. This way the native iOS alert wont show up during test execution.
See: [AppleSimulatorUtils](https://github.com/wix/AppleSimulatorUtils)

Install brew, then:

```zsh
## add module to Homebrew
brew tap wix/brew
## install module
brew install applesimutils
```

Set permissions in `wdio-ios.conf.js`.

### Android

- install `appium` and all prerequisites mentioned in <http://appium.io/docs/en/drivers/android-uiautomator2/> for `UiAutomator2`-based testing

- adjust basic config to use `appium` (see `tests/wdio-shared.config.js` for an example)

    ```javascript
    config = {
        // 4723 is the default port for Appium
        port: 4723,

        // let appium-driver take care of the mapping
        // path: '/'

        services: [
            [ 'appium' ]
        ]
    }
    ```

- enhance configuration with `android`-specific settings (see `tests/wdio-android.config.js` for an example):

    ```javascript
    wdi5: {
        platform: 'android'
    },
    capabilities = [
        {
            automationName: 'UiAutomator2',
            platformName: 'Android',

            // OS version emulator is running on
            platformVersion: '10',

            // For Android, Appium uses the first device it finds using "adb devices". So, this string simply needs to be non-empty.
            deviceName: 'any',

            // .ipa or .app file
            app: 'test/ui5-app/app/platforms/android/app/build/outputs/apk/debug/app-debug.apk',

            // By default, Appium runs tests in the native context.
            // By setting autoWebview to true,
            // it runs our tests in the cordova context.
            autoWebview: true,

            // When set to true, it will not show permission dialogs,
            // but instead grant all permissions automatically.
            autoGrantPermissions: true,

            // display emulator window
            isHeadless: false
        }
    ]
    ```

- launch desired emulator
  `$> emulator -avd <avd_name>`

- run the tests:
  `$> npx wdio ./test/wdio-android.conf.js`
  > note that `UiAutomator2` seems to always start `appium` under the hood -
  > no need to start `appium` manually

### electron

- **make sure you have the version of `chromedriver` installed that matches the one your electron app is build with.**
  for this example repo (and at the time of this writing):
  - `cordova-electron` in version `1.1.1`
  - that uses `electron` in version `4.x`
  - which uses `chromium` in version `69`
  - -> node module `chromedriver` in version `2.44.1` is needed to run the tests
    (note that meanwhile the node module `chromedriver` has started to align its' version numbers to the official `chromium` versions)

  at the same time, you need a **current** version of `chromedriver` to run browser-based tests.
  that's why we've installed two versions of `chromedriver` in this example repo,
  the once specific to the electron app as optional dependency:
  `"cordova-electron-chromedriver": "npm:chromedriver@^2.44.1"`

  - in order to use `chromedriver` with browser-based tests, the binary from the `chromedriver` is used
  - in order to run electron-app tests, the older version of `chromedriver` is linked to `node_modules/.bin/electron-chromedriver` and launched separately in the tests

  of course the above should only serve as a guide to you if you need both browser- and electron-based tests.
  if one is sufficient, adjust your environment to the corresponding `chromedriver` node module.

- adjust `wdio`-config to work with electron (see `tests/wdio-electron.config.js` for an example):

  ```javascript
  exports.config = {
    host: 'localhost', // Use localhost as chrome driver server
    port: 9515, // "9515" is the port opened by chrome driver.
    specs: [path.join('test', 'ui5-app', 'webapp', 'test', 'e2e', '**', '*.js')],
    // services: ['chromedriver'], // NOT USED, but launched separatley, see above
    maxInstances: 1,
    reporters: ['spec'],
    framework: 'mocha',
    mochaOpts: {
        timeout: 60000
    },
    capabilities: [
        {
            browserName: 'chrome',
            'goog:chromeOptions': {
                binary: path.join(
                    'test',
                    'ui5-app',
                    'app',
                    'platforms',
                    'electron',
                    'build',
                    'mac',
                    'UI5.app',
                    'Contents',
                    'MacOS',
                    'UI5'
                ),
                args: ['remote-debugging-port=9222'] // this is important!
            }
        }
    ],
    wdi5: {
        deviceType: 'web',
        logLevel: 'verbose',
        platform: 'electron',
        // this for mocking a cordova plugin
        plugins: {
            'phonegap-plugin-barcodescanner': {
                path: path.join('plugins', 'custom-plugin.js')
                respObjElectron: {
                    text: '123123',
                    format: 'EAN',
                    cancelled: ''
                }
            }
        }
    }
  ```

- run the tests:
  `$> npx wdio ./test/wdio-cordova.conf.js`

## attic from here on

### When to use `wdi5`

You are looking for a end-to-end testing framework for crossplatform UI5 application build with corodva and UI5. Your application is an UI5 web application running on different platforms like Android, iOS and Electron using cordova as a wrapper.

- Uiveri5 is not working due to eg. use of appium
- You still would like to make use of UI5 handy functions like control selectors and other function known from the sap.ui.test namespace.
  - make sure UI5 is already ready to start testing
  - etc.

#### Supported Platforms

| Platform  | Notes                |
| --------- | -------------------- |
| Browser   | Google Chrome > 80   |
| Electron  | latest major version |
| Android   | latest major version |
| Apple iOS | latest major version |


#### webdriver - UI5 bridge

To access the application's runtime environment this framework uses Webdriver API function `executeAsync`. This allows to write and call methods in the environment of the running application. The two objects `wdi5` and `bridge` are attached to the browser's `window` object to enhance the capabilities.

#### WDI5Selector

Is a plain Javascript object to enhance a `sap.ui.test.RecordReplay.ControlSelector` with the optional properties `wdio_ui5_key` and `forceSelect`.

```Javascript
const wdi5Selector = {
    wdio_ui5_key: „someCutomControlIdentifier“,
    selector: <sap.ui.test.RecordReplay.ControlSelector>
}
```

#### WDI5

This class is instantiated by the `asControl` function located in `wdioUi5-index` and returned to the test as object containing the request selector and the reference to the corresponding UI5 control.

#### Utils Overview

To be able to support different platforms the util classes create an abstraction layer of distinctive supported functionality.

## Environment

- WebDriverIO v5
- UI5
- Mocha

The package contains wdio and selenium dependencies.

### Prerequisites

UI5 Webapplication running in any browser or on any or multiple of appium and electron supported devices.

## Getting Started

### How to use

#### Config

in your `wdio.conf.js` a config object `wdi5` following optional, but recommended, properties to use all functionality.

| Property       | Description                                       |
| -------------- | ------------------------------------------------- |
| screenshotPath | location for screenshot ouput from project root   |
| logLevel       | possible values: verbose, error (default), silent |
| platform       | possible values: android, electron, ios, browser  |

custom properties can be set and will be available via the `utils.getConfig` method.

#### Logger

You can also use the WDI5 logger by calling `wdi5().getLogger()` it supports all console logging functions.

The log level is set by the config or by `wdi5().getLogger().setLoglevel()`

#### Utils

The `Utils` allow to have platform specific implementations of features such as screenshot or navigation, but rely on the same method call for the test.

Due to different platform implementations you need to instantiate the correct Util class.
For different platforms a set of specifically implemented utils.

`wdi.<Utils>.init()`

#### Appium

######## Contexts

[Context in Appium](http://appium.io/docs/en/commands/context/set-context/)
Context switching and generated context IDs.
For some reason the contexts were "NATIVE*APP" and "WEBAPP*`<webcontext>`" until April 2. Then it changed to "NATIVE*APP" and "WEBAPP*`<some generated number>`". Which is also fine after a fix was implemented.

#### Electron

Known pitfall is the chromedriver version. Make sure you run the fitting `electron-chromedriver` version to your electron version. Conflicts may occur with the browser `chromedriver` version.

## CD/ CI Pipeline Integration

### Jenkins

### Browserstack

0. Create a Browserstack account.
1. Upload app (Android or iOS) via `curl` to Bowserstack.
1.1 curl -u `<userrname>:<accessKey> -X POST "https://api-cloud.browserstack.com/app-automate/upload" -F "file=@<path-to-build-folder>/<bundle-name>.<apk|ipa>"` Put the response ahsh into your onfig file option `app`.
2. Modify the browserstack testconfiguration `wdio-bs-<android|ios>.conf.js` with your username and accessKey. Furthermore the app hash you would like to run your tests on.
3. Execute the testscripts `npm run test:android:bs`or `npm run test:ios:bs`

## Contribute

### Debug

1. `npm run _startApp`
2. launch the VSCode debugger task

#### Package Contents

`wdio-ui.js` contains the UI5 bridge.

`WebUi5.js` Class of communication objects UI5 - test framework.

`Utils.js` Class with cross platform functionality.

`BrowserUtils.js` inherits from Utils, Class with browser specific override functionality.

`NativeUtils.js` inherits from Utils, Class with native platform specific override functionality.

`Logger.js` wraps the basic JS native console statements to use the loglevel config.

### Webdriver - UI5 bridge

To add functionality to the bridge you need to enhance and add code in the bridge class. Enhance the `WebUI5` class to make the new methods available to the tester when using this framework.

#### Cordova Plugin Mock Development

The plugin file gets loaded by the plugin factory as it is defined in the wdi5 config object.

Register the plugin at the factory:

```javascript
factory.registerPlugin('plugin name', 'platform name', 'function');
```

The third parameter is a function passed to the browser context and executed. It should override the plugin function in the cordova namespace eg. `cordova.plugins.barcodeScanner.scan`.

Be aware that the context differs inside the passed function to factory.registerPlugin to this files' context. This means, that eg. the member `_pluginName` is not available.

Get the config
Function window.wdi5.getPluginConfigForPluginWithProperty(pluginName, property) can be used to retrieve a property form the plugin config. Function window.wdi5.getPluginConfigForPlugin(pluginName) can be used to retrieve the whole config form the plugin config.

### Return Type of the `executeAsync` function

The function `executeAsync` has defined return types [mentioned here](https://github.com/webdriverio/webdriverio/issues/999). So the return type is custom defined as an array of two elements first is a string representing the status, second is the value for the status.

### Commitlint

There is a `commit-msg` hook upon which [`husky`](##Husky) will run a check
for whether the formatting policy for the commit message defined by
[`commitizen`](##Commitizen) has been fulfilled.

The format for the message and options for the type can be found
[here](https://github.com/streamich/git-cz##commit-message-format)

### Git Hooks with Husky

The project uses [husky](https://github.com/typicode/husky) to
work with git hooks. Git hooks will be enabled when installing `husky`
via `npm install`. If all goes as planned, you should see something like this
during the run of `npm install`:

```sh
husky > setting up git hooks
husky > done
```

## Todos

- make use of the Chrome Testrecorder extention: [test-recorder](https://chrome.google.com/webstore/detail/ui5-test-recorder/hcpkckcanianjcbiigbklddcpfiljmhj)
- Check winston logger [npm-winston](https://www.npmjs.com/package/winston)
- export sap.ui.router to make navigation more easy
- fix: use other method than jQuery (`jQuery(ui5Control).control(0)`) to get UI5 control, since jQuery will be dropped by UI5
- generated control method bridge does generate wrong property parameter.

## Test

The UI5 app used for the package test is based on [ui5-ecosystem-showcase](https://github.com/petermuessig/ui5-ecosystem-showcase)

Run the `npm run _test` command with parameter `--spec ./test/ui5-app/test/e2e/test-ui5-ad.js` to test a single file
