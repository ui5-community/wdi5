const wdi5 = require("wdi5")

module.exports = class Page {
    open(path) {
        wdi5().getUtils().goTo(path)
    }
}
