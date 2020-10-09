
const Launcher = require('./src/launcher')
const Service = require('./src/service')

/* TODO: for wdio config utility PR
module.exports = {
    Service: new Service(),
    launcher: Launcher
*/
module.exports = new Service();
