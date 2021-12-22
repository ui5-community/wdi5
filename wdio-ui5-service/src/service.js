const Logger = require('./lib/Logger');
const wdioUI5 = require('./lib/wdioUi5-index');

module.exports = class Service {
    before(capabilities, specs) {
        // call the start function
        this.startWDI5();
    }

    /**
     * separate the start funtion for felxibility
     */
    startWDI5() {
        // UI5 bridge setup
        const context = driver ? driver : browser;
        const wdi5config = context.config.wdi5;

        // set sapui5 version constant to context for later switches
        // Before version 1.60, the only available criteria is binding context path.
        // As of version 1.72, it is available as a declarative matcher
        context._oldAPIVersion = 1.6;

        Logger.setLoglevel(wdi5config?.logLevel || 'error');

        // this is only to run in browser
        if (wdi5config && typeof wdi5config.url === 'string') {
            if (wdi5config.url.length > 0) {
                Logger.info(`open url: ${wdi5config.url}`);
                browser.url(wdi5config.url);
            } else if (wdi5config.url === '') {
                Logger.info(
                    'open url with fallback (this is not causing any issues since its is removed for navigation): #'
                );
                browser.url('#');
            } else {
                // just for error logging
                Logger.error('not opening any url, wdi5 config contains errors');
            }
        } else {
            // just for error logging
            Logger.error('not opening any url, no url was supplied in wdi5 config');
        }

        Logger.info('wdio-ui5-service before hook');

        wdioUI5.setup(context); // use wdio hooks for setting up wdio<->ui5 bridge

        // skip UI5 initialization on startup
        if (wdi5config && !wdi5config.skipInjectUI5OnStart) {
            this.injectUI5();
        } else {
            Logger.warn('wdio-ui5-service skipped injecting UI5');
        }
    }

    /**
     * inject the wdio-ui5-service sources to the UI5 app after launch
     */
    injectUI5() {
        // UI5 bridge setup
        const context = driver ? driver : browser;

        // returns promise
        let status = wdioUI5.checkForUI5Page();
        status.then(() => {
            wdioUI5.injectUI5(context); // needed to let the instance know that UI5 is now available for work
        });
    }

    after(result, capabilities, specs) {}
};
