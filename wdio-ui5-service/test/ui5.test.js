const fs = require('fs');
const path = require('path');

const selectorList = {
    forceSelect: true,
    selector: {
        id: 'versionList',
        controlType: 'sap.m.List'
    }
};

before(() => {
    const selectorCookieAccept = {
        selector: {
            id: '__button4',
            controlType: 'sap.m.Button'
        }
    };
    const buttonCookieAccept = browser.asControl(selectorCookieAccept);
    buttonCookieAccept.firePress();
});

describe('basics', () => {
    const selectorDownloadButton = {
        selector: {
            id: 'readMoreButton',
            controlType: 'sap.m.Button',
            viewName: 'sap.ui.documentation.sdk.view.Welcome'
        }
    };

    const selectorVersionButton = {
        selector: {
            id: 'changeVersionButton',
            controlType: 'sap.m.Button',
            viewName: 'sap.ui.documentation.sdk.view.App'
        }
    };

    const selectorVersionList = {
        forceSelect: true,
        selector: {
            id: 'versionList',
            controlType: 'sap.m.List'
        }
    };

    it('should have the right title', () => {
        const title = browser.getTitle();
        expect(title).toEqual('OpenUI5 SDK - Demo Kit');
    });

    it('should find a ui5 control by id', () => {
        const controlDownloadButton = browser.asControl(selectorDownloadButton);
        expect(controlDownloadButton.getText()).toEqual('Download');
    });

    it('should get the parent control', () => {
        const controlVersionButton = browser.asControl(selectorVersionButton)
        const headerToolbar = controlVersionButton.getParent()

        expect(headerToolbar.getVisible()).toBeTruthy();
        expect(headerToolbar.getId()).toStrictEqual("sdk---app--headerToolbar")
    });

    it('should click a ui5 button (version selector) by id', () => {
        // open the version select dialog
        const controlVersionButton = browser.asControl(selectorVersionButton);
        controlVersionButton.firePress();

        // check for visibility
        expect(browser.asControl(selectorList).getVisible()).toBeTruthy();

        browser.keys('Escape'); // close popup
    });

    it('should check the length of verison list without getting all subcontrols of aggregation', () => {
        // open the version select dialog
        const controlVersionButton = browser.asControl(selectorVersionButton);
        controlVersionButton.firePress();

        const list = browser.asControl(selectorVersionList)
        const numberOfItems = list.getItems(true).length // new param

        // not closing because of minor trouble with ui5 when closing opening this popup
        // browser.keys('Escape'); // close popup

        // check for number
        expect(numberOfItems).toBeGreaterThanOrEqual(537) // V1.86.1
    });

    it('should retieve the second control of verison list without getting all subcontrols of aggregation', () => {
        // open the version select dialog
        const controlVersionButton = browser.asControl(selectorVersionButton);
        controlVersionButton.firePress();

        const list = browser.asControl(selectorVersionList)
        const item3 = list.getItems(3) // new param

        // not closing because of minor trouble with ui5 when closing opening this popup
        // browser.keys('Escape'); // close popup

        // check for number
        expect(item3.getTitle()).toEqual("1.85") // V1.85.2
    });

    it('should find a control w/o id locator', () => {
        const selectorWithoutId = {
            selector: {
                viewName: 'sap.ui.documentation.sdk.view.Welcome',
                controlType: 'sap.m.Button',
                properties: {
                    text: 'Get Started with UI5'
                }
            }
        };

        expect(browser.asControl(selectorWithoutId).getText()).toBe('Get Started with UI5');
    });

    it('should not report an error on successful $control.focus()', () => {
        const focusResult = browser.asControl(selectorVersionButton).focus();
        expect(focusResult).toBeTruthy();

        // assert focus on element also via webdriver.io api
        const wdFocusResult = focusResult.getWebElement();
        expect(wdFocusResult.isFocused()).toBeTruthy();
    });

    it('should throw an error on unsuccessful $control.focus()', () => {
        expect(() => {
            browser.asControl({ selector: { id: 'doesnt_exist' } }).focus();
        }).toThrow();
    });

    it('should navigate', () => {
        browser.setUrl('api/sap.m.Button')

        const header = browser.asControl({ selector: { id: '__xmlview0--title' } })
        expect(header.getVisible()).toBeTruthy();
    });

    it('should navigate via hash', () => {
        browser.goTo('#events/Summary')
        const eventsHeader = browser.asControl({ selector: { id: '__xmlview0--events' } })
        expect(eventsHeader.getVisible()).toBeTruthy();
    });
});

describe('locate ui5 control via regex', () => {
    /**
     * click the version list button to open a popup on the sdk site
     * then close it via "esc" key
     * @param {String|RegExp} idRegex
     */
    function _assert(idRegex) {
        const selector = {
            forceSelect: true, // make sure we're retrieving from scratch
            selector: {
                id: idRegex
            }
        };
        browser.asControl(selector).firePress();
        expect(browser.asControl(selectorList).getVisible()).toBeTruthy();

        browser.keys('Escape'); // close popup
    }
    it('plain regex /.../', () => {
        return _assert(/.*changeVersionButton$/);
    });

    it('plain regex + flags /.../gmi', () => {
        return _assert(/.*changeVersionButton$/gim);
    });
    it('new RegEx(/.../flags)', () => {
        return _assert(new RegExp(/.*changeVersionButton$/));
    });

    it('new RegEx(/.../flags)', () => {
        return _assert(new RegExp(/.*changeVersionButton$/gi));
    });

    it('new RegEx("string")', () => {
        return _assert(new RegExp('.*changeVersionButton$'));
    });

    it('new RegEx("string", "flags")', () => {
        return _assert(new RegExp('.*changeVersionButton$', 'gmi'));
    });

    it('regex shorthand matchers are handled properly', () => {
        return _assert(/.*change\w.*Button$/);
    });
});

describe('screenshots', () => {
    it('should validate screenshots capability', () => {
        browser.screenshot('ui5-sdk-page');

        // seed to wait some time until the screenshot is actually saved to the file system before reading it again
        setTimeout(() => {
            const screenShotPath = path.join('wdio-ui5-service', 'test', 'report', 'screenshots');
            const screenshots = fs.readdirSync(screenShotPath);
            const ours = screenshots.find((shot) => shot.match(/.*ui5-sdk-page.*/));
            expect(ours).toMatch(/.*ui5-sdk-page.*/);
        }, 1500);
    });

    it('should validate screenshots capability with unnamed screenshot', () => {
        browser.screenshot();

        // seed to wait some time until the screenshot is actually saved to the file system before reading it again
        setTimeout(() => {
            const screenShotPath = path.join('wdio-ui5-service', 'test', 'report', 'screenshots');
            const screenshots = fs.readdirSync(screenShotPath);
            const ours = screenshots.find((shot) => shot.match(/.*-browser-screenshot.png/));
            expect(ours).toMatch(/.*-browser-screenshot.png/);
        }, 1500);
    });
});
