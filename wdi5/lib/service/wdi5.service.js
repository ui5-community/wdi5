
const SevereServiceError = require('webdriverio')
const wdi5 = require('wdi5');

class WDI5Service {

    before(capabilities, specs) {

        const platform = browser.config.wdi5.platform // android, ios, browser, electron
        const deviceType = browser.config.wdi5.deviceType // web, native

        switch (deviceType) {
            case "web":
                // browser, electron
                // create instance
                wdi5(browser);
                wdi5().getLogger().log('before hook for web');
                break;
            case "native":
                // ios, android
                driver.setAsyncTimeout(6000);

                // call once to init
                // assume the start context is the webcontext -> "js.appiumTest"
                // first call need to be with the webcontext
                wdi5(driver, driver.getContext());
                wdi5().getLogger().log('before hook for native');
                break;
            default:
                // assume browser
                wdi5(browser);
                wdi5().getLogger().log('before hook for default(web)');
                break;
        }

        // log the config
        wdi5()
            .getLogger()
            .log('configurations: ' + JSON.stringify(wdi5().getUtils().getConfig()));
    };

    after(result, capabilities, specs) {
        wdi5().getLogger().log('after hook');
        if (result === 1) {
            wdi5().getLogger().error('some tests failed');
            // test failed
            if (wdi5().getUtils().getConfig('logLevel') !== 'verbose') {
                wdi5().getLogger().error('here is the full log');
                // write log if loglevel is other than verbose
                wdi5().getLogger().printLogStorage();
            }
        }
    };
}

module.exports = new WDI5Service()
