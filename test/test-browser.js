// javascript
// standalone.js

const path = require('path');
const { remote } = require('webdriverio');
const sync = require('@wdio/sync').default

const optsSimple = {
    runner: 'local',
    baseUrl: 'http://localhost:8888/',
    outputDir: __dirname,
    capabilities: {
        browserName: 'chrome'
    },
    // specs: [path.join('test', 'ui5-app', 'webapp', 'test', 'e2e', '*.js')],
    reporters: ['spec'],
    mochaOpts: {
        timeout: 50000
    },
    framework: 'mocha',
}

// wdi5 test app
remote(optsSimple).then((browserSample) => sync(() => {
    globalThis.browserSample = browserSample;

    browserSample.url('index.html');

    console.log("sample app title: " + browserSample.getTitle())

    // browserSample.deleteSession()
}))

// idas app started in bg
remote({
    runner: 'local',
    outputDir: __dirname,
    baseUrl: 'http://localhost:8080/',
    capabilities: {
        browserName: 'chrome'
    },
    // specs: [path.join('test', 'ui5-app', 'webapp', 'test', 'e2e', '*.js')],
    reporters: ['spec'],
    mochaOpts: {
        timeout: 50000
    },
    framework: 'mocha',
}).then((browserIDAS) => sync((test) => {

    browserIDAS.url('index.html');

    console.log("-------------")
    console.log("idas app tile: " + browserIDAS.getTitle())
    console.log("sample app tilte: " + globalThis.browserSample.getTitle())

    globalThis.browserSample.deleteSession()
    browserIDAS.deleteSession()
}))
