[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Overview

A repository showcasing UI5's RecordReplay API in conjuntion with WebdriverIO

End to end enhancement testing package for UI5 with Webdriver

# When to use

-   Uiveri5 is not working due to eg. use of appium
-   You still would like to make use of UI5 control selectors known from the sap.ui.test namespace.

# Environment

-   WebDriverIO v5
-   UI5
-   Selenium
-   Mocha

The package contains wdio and selenium dependencies.

## Prerequisites

UI5 Webapplication running in any browser or on any or multiple of appium and electron supported devices.

# Getting Started

## How to use
### Config
in your `wdio.conf.js` a config object `wdi5` following optional properties


| Property       | Description   |
| -------------  | ------------- |
| screenshotPath | location for screenshot ouput from project root |

custom properties can be set and will be available via the `utils.getConfig` method.

## UI5 Bridge

Bridge to ui5
Init the needed package parts
`wdi.wdioui5.init()`

Return values of the `done function of executeAsync` are 'Likewise, any WebElements in the script result will be returned to the client as WebElement JSON objects.' -> https://github.com/webdriverio/webdriverio/issues/2728#issuecomment-388330067

| Method | SAP RecordReplay Method | Description |
| ------ | ----------------------- | ----------- |
| getSelectorForElement | findControlSelectorByDOMElement | Find the best control selector for a DOM element. A selector uniquely represents a single element. The 'best' selector is the one with which it is most likely to uniquely identify a control with the least possible inspection of the control tree. |
| getControl | findDOMElementByControlSelector | Find DOM element representation of a control specified by a selector object. |
| interactWithControl | interactWithControl | Interact with specific control. |
| waitForUI5 | waitForUI5 | Wait for UI5 to complete processing, poll until all asynchronous work is finished, or timeout. |

### Types of Control Selectors
sap.ui.test.RecordReplay.ControlSelector

| selector | description |
| -------- | ----------- |
| id | supported |
| viewName | supported |
| controlType | supported |
| bindingPath | not supported, but implemented |
| I18NText | not supported |
| labelFor | not supported |
| properties | supported |

### Create Control Selector
```javascript
// create selector
const selector = {
    wdio_ui5_key: "mainUserInput", // unique internal key to map and find a control
    selector: {
        id: "mainUserInput", // ID of a control (global or within viewName, if viewName is defined)
        bindingPath: { // internally object of sap.ui.test.matchers.BindingPath is created
            propertyPath: "/Customers('TRAIH')/ContactName"
        },
        properties: { // internally object of sap.ui.test.matchers.Properites is created
            value: "Helvetius Nagy"
        },
        viewName: "test.Sample.view.Main",
        controlType: "sap.m.Input"
    }
}
```

## Utils

Due to different platform implementations you need to instantiate the correct Util class.
For different platforms a set of specifically implemented utils.

`wdi.<Utils>.init()`

### Appium

#### Contexts

[Context in Appium](http://appium.io/docs/en/commands/context/set-context/)
Context switching and generated context IDs.
For some reason the contexts were "NATIVE_APP" and "WEBAPP_<webcontext>" until April 2. Then it changed to "NATIVE_APP" and "WEBAPP_<some generated number>". Which is also fine after a fix was implemented.

### Electron
Known pitfall is the chromedriver version. Make sure you run the fitting `electron-chromedriver` version to your electron version. Conflicts may occur with the browser `chromedriver` version.

# Contribute

## Debug
1. `npm run _startApp`
2. launch the VSCode debugger task

## Package Contents

`wdio-ui.js` contains the UI5 bridge.
`Utils.js` Class with cross platform functionality

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

```txt
husky > setting up git hooks
husky > done
```

# Todos
- nothing open

# Test
The ui5 app used for the package test is based on [ui5-ecosystem-showcase](https://github.com/petermuessig/ui5-ecosystem-showcase)

Run the `npm run _test` command with parameter `--spec ./test/ui5-app/test/e2e/test-ui5-ad.js` to test a single file

# License

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@vobu](https://twitter.com/vobu) or @[@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.
