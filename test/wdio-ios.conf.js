const path = require("path")
let config = require("./wdio-shared.conf").config

config.capabilities = [
    {
        automationName: "XCUITest",

        platformName: "iOS",

        // The version of the Android or iOS system
        platformVersion: "13.4",

        // For iOS, this must exactly match the device name as seen in Xcode.
        deviceName: "iPhone SE (2nd generation)", 

        // Where to find the .apk or .ipa file to install on the device. The exact location
        // of the file may change depending on your Cordova version.
        app: path.join("test", "ui5-app", "app", "platforms", "ios", "build", "emulator", "UI5.app"),

        // By default, Appium runs tests in the native context. By setting autoWebview to
        // true, it runs our tests in the Cordova context.
        autoWebview: true,

        // When set to true, it will not show permission dialogs, but instead grant all
        // permissions automatically.
        autoGrantPermissions: true
    }
]

config.outputDir = path.join("test", "report", "logs")

config.wdi5.platform = "ios"

exports.config = config
