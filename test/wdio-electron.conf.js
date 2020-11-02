const path = require('path');
require('dotenv').config();
const WDI5Service = require('wdi5/lib/service/wdi5.service');

// https://github.com/electron-userland/spectron/issues/74
exports.config = {
    path: '/', // Path to driver server endpoint.
    host: 'localhost', // Use localhost as chrome driver server
    port: 9515, // "9515" is the port opened by chrome driver.
    specs: [path.join('test', 'ui5-app', 'webapp', 'test', 'e2e', '*.js')],
    services: [[WDI5Service]],
    chromeDriverLogs: path.join('test', 'report', 'logs'),
    maxInstances: 1,
    reporters: ['spec'],
    outputDir: path.join('test', 'report', 'logs'),
    coloredLogs: true,
    framework: 'mocha',
    mochaOpts: {
        timeout: 60000
    },
    capabilities: [
        {
            isHeadless: false,
            browserName: 'chrome',
            'goog:chromeOptions': {
                w3c: false,
                binary: path.join(
                    process.cwd(),
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
                args: ['remote-debugging-port=9222', 'window-size=1440,800']
            }
        }
    ],
    wdi5: {
        deviceType: 'web',
        screenshotPath: path.join('test', 'report', 'screenshots'),
        logLevel: 'verbose',
        platform: 'electron',
        plugins: {
            'phonegap-plugin-barcodescanner': {
                respObjElectron: {
                    text: '123-123-asd',
                    format: 'EAN',
                    cancelled: ''
                },
                scanCode: '123-123-asd',
                format: 'EAN'
            }
        }
    }
};
