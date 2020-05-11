#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const replace = require('replace-in-file');

const index = {
    html: async () => {
        const file = path.resolve('www', 'index.html');
        const options = {
            files: file,
            from: /<\/head>/,
            to: '<script type="text/javascript" src="cordova.js"></script></head>'
        };
        await replace(options);
        console.info('injected cordova.js into index.thml');
    }
};

const manifest = {
    json: async () => {
        const file = path.resolve('www', 'manifest.json');
        const json = JSON.parse(fs.readFileSync(file));
        json['sap.app'].dataSources.BackendDataSource.uri = 'https://services.odata.org/V2/Northwind/Northwind.svc/';
        fs.writeFileSync(file, JSON.stringify(json, null, 2));
        console.info(`injected full BE URL into ${file}`);
    }
};

index.html();
manifest.json();
