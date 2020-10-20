#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log(`[ios] Preparing installation ...`);

const iosPlatformFolderPath = path.resolve('platforms', 'ios');

if (fs.existsSync(iosPlatformFolderPath)) {
    console.log(`[ios] Cleaning ...`);
    fs.removeSync(path.resolve(iosPlatformFolderPath, 'build'));
    execSync(`cordova clean ios`, { stdio: 'inherit' });
} else {
    console.log(`[ios] Installing ios platform ...`);
    execSync(`cordova platform add ios@latest`, { stdio: 'inherit' });
}

console.log(`[ios] Starting build ...`);
execSync(`cordova build ios --no-telemetry`, { //  use this parameter to build a ios app for on-device testing "--device"
    stdio: 'inherit'
});

