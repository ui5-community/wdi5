const wdi5 = require("../../../../../../dist/wdi5").wdi5
module.exports = class Page {
    async open(path) {
        wdi5.goTo(path)
    }
}
