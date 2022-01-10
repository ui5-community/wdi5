const SevereServiceError = require('webdriverio');
const wdi5 = require('wdi5');

// the one instance of wdi5 :)
let _wdi5 = null;

class WDI5Service {
    async before(capabilities, specs) {
        const platform = browser.config.wdi5.platform; // android, ios, browser, electron
        const deviceType = browser.config.wdi5.deviceType; // web, native

        switch (deviceType) {
            case 'web':
                // browser, electron
                _wdi5 = await wdi5(browser);
                _wdi5.getLogger().log('before hook for web');
                break;
            case 'native':
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
                _wdi5 = await wdi5(browser);
                _wdi5.getLogger().log('before hook for default(web)');
                break;
        }

        // log the config
        _wdi5.getLogger().log('configurations: ' + JSON.stringify(_wdi5.getUtils().getConfig()));
    }

    async after(result, capabilities, specs) {
        // this is assuming _wdi5 was successfully "instanced" in before()
        _wdi5.getLogger().log('after hook');
        if (result === 1) {
            _wdi5.getLogger().error('some tests failed');
            // test failed
            if (_wdi5.getUtils().getConfig('logLevel') !== 'verbose') {
                _wdi5.getLogger().error('here is the full log');
                // write log if loglevel is other than verbose
                _wdi5.getLogger().printLogStorage();
            }
        }
    }
}

module.exports = new WDI5Service();
