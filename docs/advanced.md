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

## iOS

-   install `appium` and all prerequisites mentioned in <http://appium.io/docs/en/drivers/ios-xcuitest/index.html> for `XCUITest`-based testing

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

-   enhance configuration with iOS-specific settings (see `tests/wdio-ios.config.js` for an example):

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

    refer to the [xcuitest-driver capabilities documentation](https://github.com/appium/appium-xcuitest-driver#desired-capabilities) for a complete list of possible settings

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

### iOS Permissions
To manually set permissions for your application under test like file access or notifications. This way the native iOS alert wont show up during test execution.
See: https://github.com/wix/AppleSimulatorUtils

Install brew, then:

```zsh
# add module to Homebrew
brew tap wix/brew
# install module
brew install applesimutils
```

Set permissions in `wdio-ios.conf.js`.

## Android

-   install `appium` and all prerequisites mentioned in <http://appium.io/docs/en/drivers/android-uiautomator2/> for `UiAutomator2`-based testing


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

-   enhance configuration with `android`-specific settings (see `tests/wdio-android.config.js` for an example):

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

## electron

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
                path: "./test/plugins/custom-plugin.js",
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

# *** attic from here on ***

# When to use `wdi5`

You are looking for a end-to-end testing framework for crossplatform UI5 application build with corodva and UI5. Your application is an UI5 web application running on different platforms like Android, iOS and Electron using cordova as a wrapper.

-   Uiveri5 is not working due to eg. use of appium
-   You still would like to make use of UI5 handy functions like
    -   control selectors and other function known from the sap.ui.test namespace.
    -   make sure UI5 is already ready to start testing
    -   etc.

## Supported Platforms

| Platform  | Notes                |
| --------- | -------------------- |
| Browser   | Google Chrome > 80   |
| Electron  | latest major version |
| Android   | latest major version |
| Apple iOS | latest major version |

## How it works

![Call History](CallHistory.png)

## webdriver - UI5 bridge

To access the application's runtime environment this framework uses Webdriver API function `executeAsync`. This allows to write and call methods in the environment of the running application. The two objects `wdi5` and `bridge` are attached to the browser's `window` object to enhance the capabilities.

## WDI5Selector

Is a plain Javascript object to enhance a `sap.ui.test.RecordReplay.ControlSelector` with the property `wdio_ui5_key`.

```Javascript
const wdi5Selector = {
    wdio_ui5_key: „someCutomControlIdentifier“,
    selector: <sap.ui.test.RecordReplay.ControlSelector>
}
```

## WDI5

This class is instantiated by the `asControl` function located in `wdioUi5-index` and returned to the test as object containing the request selector and the reference to the corresponding UI5 control.

## Utils

To be able to support different platforms the util classes create an abstraction layer of distinctive supported functionality.

# Environment

-   WebDriverIO v5
-   UI5
-   Mocha

The package contains wdio and selenium dependencies.

## Prerequisites

UI5 Webapplication running in any browser or on any or multiple of appium and electron supported devices.

# Getting Started

## How to use

### Config

in your `wdio.conf.js` a config object `wdi5` following optional, but recommended, properties to use all functionality.

| Property       | Description                                       |
| -------------- | ------------------------------------------------- |
| screenshotPath | location for screenshot ouput from project root   |
| logLevel       | possible values: verbose, error (default), silent |
| platform       | possible values: android, electron, ios, browser  |

custom properties can be set and will be available via the `utils.getConfig` method.

## UI5 Bridge

### How to use it

After initialization the functionality is attached to the Webdriver browser/ device object and can be called from there.

The main featue is devilerd with the provided `asControl` function which returns the WDIO frameworks own bridge object of a UI5 control. This return object of instance `WDI5` provides multiple functions bridged to the UI5 control under the hood.

Methods to check status of a control.

-   hasStyleClass
-   getProperty
-   getAggregation
-   isVisible

Methods to change the status of a control.

-   setProperty

Methods to execute an action on a control. These functions return the the object of type WebUi5 to allow method chaning.

-   enterText
-   press
-   fireEvent

Make sure when you call a method on a control the underlying UI5 control type supports the method. Eg. call `press()` action on a `sap.m.Button` but not on a `sap.m.Text`.

### Helper

In case you are not able to create an explicit selector to your control, but you are able to find it via any webdriver strategy, you can use the `getSelectorForElement` method of the bridge. This function gets the webdriver element as parameter and returns a selector which can then beeing used in the `asControl` function.

#### Example calls

```javascript
const selector = {...} // cerate selector for a sap.m.Input on a view
const oTinput = browser.asControl(selector) // retuns a WebUi5 obejct
oTinput.enterText('some Text').hasStyleClass("customStyleClass")
```

### Under the Hood

Bridge to UI5
Init the needed package parts
`wdi().getWDioUi5().init()`

Return values of the `done function of executeAsync` are 'Likewise, any WebElements in the script result will be returned to the client as WebElement JSON objects.' -> https://github.com/webdriverio/webdriverio/issues/2728#issuecomment-388330067

| Method                  | SAP RecordReplay Method         | Description                                                                                                                                                                                                                                           |
| ----------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| + getSelectorForElement | findControlSelectorByDOMElement | Find the best control selector for a DOM element. A selector uniquely represents a single element. The 'best' selector is the one with which it is most likely to uniquely identify a control with the least possible inspection of the control tree. |
| - getControl            | findDOMElementByControlSelector | Find DOM element representation of a control specified by a selector object.                                                                                                                                                                          |
| + interactWithControl   | interactWithControl             | Interact with specific control.                                                                                                                                                                                                                       |
| + waitForUI5            | waitForUI5                      | Wait for UI5 to complete processing, poll until all asynchronous work is finished, or timeout.                                                                                                                                                        |

### How it works

### Types of Control Selectors

sap.ui.test.RecordReplay.ControlSelector

| selector    | description |
| ----------- | ----------- |
| id          | supported   |
| viewName    | supported   |
| controlType | supported   |
| bindingPath | supported   |
| I18NText    | tbd         |
| Anchestor   | tbd         |
| labelFor    | tbd         |
| properties  | supported   |

### Create Control Selector

```javascript
// create selector
const selector = {
    // wdio-ui5 selector
    wdio_ui5_key: 'mainUserInput', // unique internal key to map and find a control
    selector: {
        // sap.ui.test.RecordReplay.ControlSelector
        id: 'mainUserInput', // ID of a control (global or within viewName, if viewName is defined)
        bindingPath: {
            // internally object of sap.ui.test.matchers.BindingPath is created
            propertyPath: "/Customers('TRAIH')/ContactName"
        },
        properties: {
            // internally object of sap.ui.test.matchers.Properites is created
            value: 'Helvetius Nagy'
        },
        viewName: 'test.Sample.view.Main',
        controlType: 'sap.m.Input'
    }
};
```

#### Flaws

[OpenUI5 Issue](https://github.com/SAP/openui5/issues/2887) sap/ui/test/matchers/BindingPath cannot locate control by named model and root property

If you use a named model and a root property there is an issue in UI5 control selector.

```javascript
        bindingPath: { // internally object of sap.ui.test.matchers.BindingPath is created
            modelName: "myModelName",
            propertyPath: "/Value" // a double slash in created internally to fix the issue
        },
```

The function `_getFormattedPath` in [`BindingPath.js`](https://github.com/SAP/openui5/blob/master/src/sap.ui.core/src/sap/ui/test/matchers/BindingPath.js) does `substring(1)` if it is a named model.

This was tmp fixed in `wdio-ui5 - createMatchers` function. In case this will be fixed by UI5 this need to be adjusted.

## Cordova Plugin Mock Development

The plugin file gets loaded by the plugin factory as it is defined in the wdi5 config object.

Register the plugin at the factory:
```javascript
factory.registerPlugin('plugin name', 'platform name', 'function');
```

The third parameter is a function passed to the browser context and executed. It should override the plugin function in the cordova namespace eg. `cordova.plugins.barcodeScanner.scan`.

Be aware that the context differs inside the passed function to factory.registerPlugin to this files' context. This means, that eg. the member `_pluginName` is not available.

Get the config
Function window.wdi5.getPluginConfigForPluginWithProperty(pluginName, property) can be used to retrieve a property form the plugin config. Function window.wdi5.getPluginConfigForPlugin(pluginName) can be used to retrieve the whole config form the plugin config.

## Logger

You can also use the WDI5 logger by calling `wdi5().getLogger()` it supports all console logging functions.

The log level is set by the config or by `wdi5().getLogger().setLoglevel()`

## Utils

The `Utils` allow to have platform specific implementations of features such as screenshot or navigation, but rely on the same method call for the test.

### Appium

#### Contexts

[Context in Appium](http://appium.io/docs/en/commands/context/set-context/)
Context switching and generated context IDs.
For some reason the contexts were "NATIVE*APP" and "WEBAPP*<webcontext>" until April 2. Then it changed to "NATIVE*APP" and "WEBAPP*<some generated number>". Which is also fine after a fix was implemented.

### Electron

Known pitfall is the chromedriver version. Make sure you run the fitting `electron-chromedriver` version to your electron version. Conflicts may occur with the browser `chromedriver` version.

# Contribute

## Debug

1. `npm run _startApp`
2. launch the VSCode debugger task

## Package Contents

`wdio-ui.js` contains the UI5 bridge.

`WebUi5.js` Class of communication objects UI5 - test framework.

`Utils.js` Class with cross platform functionality.

`BrowserUtils.js` inherits from Utils, Class with browser specific override functionality.

`NativeUtils.js` inherits from Utils, Class with native platform specific override functionality.

`Logger.js` wraps the basic JS native console statements to use the loglevel config.

## Class Diagram

![Class Diagram](class_diagram.png)

## Webdriver - UI5 bridge

To add functionality to the bridge you need to enhance and add code in the bridge class. Enhance the `WebUI5` class to make the new methods available to the tester when using this framework.

## Return Type of the `executeAsync` function

The function `executeAsync` has defined return types [mentioned here](https://github.com/webdriverio/webdriverio/issues/999). So the return type is custom defined as an array of two elements first is a string representing the status, second is the value for the status.

## Utils

Due to different platform implementations you need to instantiate the correct Util class.
For different platforms a set of specifically implemented utils.

`wdi.<Utils>.init()`

## Commitlint

There is a `commit-msg` hook upon which [`husky`](#Husky) will run a check
for whether the formatting policy for the commit message defined by
[`commitizen`](#Commitizen) has been fulfilled.

The format for the message and options for the type can be found
[here](https://github.com/streamich/git-cz#commit-message-format)

## Git Hooks with Husky

The project uses [husky](https://github.com/typicode/husky) to
work with git hooks. Git hooks will be enabled when installing `husky`
via `npm install`. If all goes as planned, you should see something like this
during the run of `npm install`:

```sh
husky > setting up git hooks
husky > done
```

# Todos

- make use of the Chrome Testrecorder extention: https://chrome.google.com/webstore/detail/ui5-test-recorder/hcpkckcanianjcbiigbklddcpfiljmhj
- Check winston logger (https://www.npmjs.com/package/winston)
- export sap.ui.router to make navigation more easy
- use other method than jQuery (`jQuery(ui5Control).control(0)`) to get UI5 control, since jQuery will be dropped by UI5
- Spread Testfiles in multiple modules (jest like)

# Test

The UI5 app used for the package test is based on [ui5-ecosystem-showcase](https://github.com/petermuessig/ui5-ecosystem-showcase)

Run the `npm run _test` command with parameter `--spec ./test/ui5-app/test/e2e/test-ui5-ad.js` to test a single file
