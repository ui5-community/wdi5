[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A repository showcasing UI5's RecordReplay API in conjuntion with WebdriverIO

# Overview

End to end enhancement testing package for UI5 with Webdriver

# When to use

-   Uiveri5 is not working due to eg. use of appium
-   You still would like to make use of UI5 control selectors known from the sap.ui.test namespace.

# Environment

-   WebDriverIO > v5
-   UI5
-   Selenium
-   Mocha

## Package
The package contains wdio and selenium dependencies.

## Prerequisites

TBD

# Getting Started

## How to use
### Config
in your `wdio.conf.js` a config object `wdi5` following optional properties


| Property       | Description   |
| -------------  | ------------- |
| screenshotPath | location for screenshot ouput from project root |


## UI5 Bridge

Bridge to ui5
Init the needed package parts
`wdi.wdioui5.init()`

Return values of the `done function of executeAsync` are 'Likewise, any WebElements in the script result will be returned to the client as WebElement JSON objects.' -> https://github.com/webdriverio/webdriverio/issues/2728#issuecomment-388330067

## Utils

Due to different platform implementations you need to instantiate the correct Util class.
For different platforms a set of specifically implemented utils.

`wdi.<Utils>.init()`

### Contexts

[Context in Appium](http://appium.io/docs/en/commands/context/set-context/)
Context switching and generated context IDs.
For some reason the contexts were "NATIVE_APP" and "WEBAPP_<webcontext>" until April 2. Then it changed to "NATIVE_APP" and "WEBAPP_<some generated number>". Which is also fine after a fix was implemented.

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

# Licence

This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy [@vobu](https://twitter.com/vobu) or @[@The_dominiK](https://twitter.com/The_dominiK) a beer when you see them.
