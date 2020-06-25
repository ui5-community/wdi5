const wdi5 = require("../../../../../../index")

module.exports = class Page {
    open(path) {
        wdi5().getUtils().goTo(path)
    }
}
