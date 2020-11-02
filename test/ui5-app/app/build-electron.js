#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log(`[electron] Preparing installation ...`);

const electronPlatformFolderPath = path.resolve('platforms', 'electron');

if (fs.existsSync(electronPlatformFolderPath)) {
    console.log(`[electron] Cleaning ...`);
    fs.removeSync(path.resolve(electronPlatformFolderPath, 'build'));
    execSync(`cordova clean electron`, { stdio: 'inherit' });
} else {
    console.log(`[electron] Installing electron platform ...`);
    execSync(`cordova platform add electron@latest`, { stdio: 'inherit' });
}

console.log(`[electron] Starting build ...`);
execSync(`cordova build electron --no-telemetry --debug`, {
    stdio: 'inherit'
});
