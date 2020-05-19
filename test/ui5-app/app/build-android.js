#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const {execSync} = require('child_process');

console.log(`[android] Preparing installation ...`);

const androidPlatformFolderPath = path.resolve('platforms', 'android');

if (fs.existsSync(androidPlatformFolderPath)) {
    console.log(`[android] Cleaning ...`);
    fs.removeSync(path.resolve(androidPlatformFolderPath, 'build'));
    execSync(`cordova clean android`, {stdio: 'inherit'});
} else {
    console.log(`[android] Installing android platform ...`);
    execSync(`cordova platform add android@latest`, {stdio: 'inherit'});
}

console.log(`[android] Starting build ...`);
// execSync(`cordova build android --no-telemetry --emulator`, {
execSync(`cordova run android --no-telemetry --emulator`, {
    stdio: 'inherit'
});

