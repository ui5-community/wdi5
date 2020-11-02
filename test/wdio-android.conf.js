const path = require('path');
let config = require('./wdio-shared.conf').config;
require('dotenv').config();

// This defines which kind of device we want to test on, as well as how it should be
// configured.
config.capabilities = [
    {
        automationName: 'UiAutomator2',

        platformName: 'Android',

        // The version of the Android system
        platformVersion: '11',

        // For Android, Appium uses the first device it finds using "adb devices". So, this string simply needs to be non-empty.
        deviceName: 'any',

        chromeOptions: {w3c: false},

        // Where to find the .apk or .ipa file to install on the device. The exact location
        // of the file may change depending on your Cordova version.
        app: path.join(
            'test',
            'ui5-app',
            'app',
            'platforms',
            'android',
            'app',
            'build',
            'outputs',
            'apk',
            'debug',
            'app-debug.apk'
        ),

        // By default, Appium runs tests in the native context. By setting autoWebview to
        // true, it runs our tests in the Cordova context.
        autoWebview: true,

        // When set to true, it will not show permission dialogs, but instead grant all
        // permissions automatically.
        autoGrantPermissions: true,

        isHeadless: false,

        // name this to the AVD emulator of your liking
        avd: 'Pixel_XL_API_30'
    }
];

config.wdi5.platform = 'android';

exports.config = config;
