#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

const source = path.resolve('..', 'webapp');
const target = path.resolve('./www');

console.log('copying sources...');


const filterFunc = (src, dest) => {
    return !(src.endsWith('.map') || src.endsWith('-dbg.js') || src.includes('index.html'));
};

const options = {
    preserveTimestamps: true,
    filter: filterFunc
};
fs.copySync(source, target, options);

console.log('successfully copied ' + source + '\nto ' + target + '!');
