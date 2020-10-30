const path = require('path');
let config = require('./wdio-shared.conf').config;
require('dotenv').config()

const _xcodeOrgId = process.env.XCODEORGID;
const _xcodeSigningId = process.env.XCODESIGNINGID;
const _iOSUDID = process.env.IOSUDUD;

config.capabilities = [
    {
        automationName: 'XCUITest',

        platformName: 'iOS',

        // The version of the Android or iOS system
        platformVersion: '14.0',

        // For iOS, this must exactly match the device name as seen in Xcode.
        deviceName: 'iPhone 11',

        // Where to find the .apk or .ipa file to install on the device. The exact location
        // of the file may change depending on your Cordova version.
        // -- binary location after build for device (cordova build --device)
        // app: path.join('test', 'ui5-app', 'app', 'platforms', 'ios', 'build', 'device', 'UI5.ipa'),
        // -- binary location after build for emulator (cordova build --emulator)
        app: path.join('test', 'ui5-app', 'app', 'platforms', 'ios', 'build', 'emulator', 'UI5.app'),

        // By default, Appium runs tests in the native context. By setting autoWebview to
        // true, it runs our tests in the Cordova context.
        autoWebview: true,

        /*
        * This block is needed to execute tests on real devices
        * comment out for emulator tests
        * https://github.com/appium/appium-xcuitest-driver#usage
        * https://github.com/appium/appium-xcuitest-driver/blob/master/docs/real-device-config.md
        */ /*
        "xcodeOrgId": _xcodeOrgId,
        "xcodeSigningId": _xcodeSigningId,
        useNewWDA: true,
        udid: _iOSUDID,
        */

        // display sim window - seems to default to true
        // w/ macOS 10.15.4, iOS sim 11.4.1 (921.9), appium 1.17.1
        isHeadless: false,

        // http://appium.io/docs/en/drivers/ios-xcuitest/#capabilities
        // https://appiumpro.com/editions/43-setting-ios-app-permissions-automatically
        // https://github.com/wix/AppleSimulatorUtils
        permissions: "{\"jss.wdi5.sample\": {\"camera\": \"yes\",\"notifications\": \"yes\"}}"
    }
];

config.outputDir = path.join('test', 'report', 'logs');

config.wdi5.platform = 'ios';

exports.config = config;
