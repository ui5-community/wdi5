#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const {execSync} = require('child_process');

console.log(`[build:ios] Preparing installation ...`);

const iosPlatformFolderPath = path.resolve('platforms', 'ios');

if (fs.existsSync(iosPlatformFolderPath)) {
    console.log(`\t> Cleaning ...`);
    fs.removeSync(path.resolve(iosPlatformFolderPath, 'build'));
    execSync(`cordova clean ios`, {stdio: 'inherit'});
} else {
    console.log(`\t> Installing ios platform ...`);
    execSync(`cordova platform add ios@latest`, {stdio: 'inherit'});
}

console.log(`[build:ios] Starting develop build ...`);
// execSync(`cordova build ios --no-telemetry --debug`, {
//     stdio: 'inherit'
// });
execSync(`cordova run ios --no-telemetry`, {
    stdio: 'inherit'
});
