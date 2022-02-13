const wdi5 = require('wdi5');

module.exports = class Page {
    async open(path) {
        (await wdi5()).getUtils().goTo(path);
    }
};
