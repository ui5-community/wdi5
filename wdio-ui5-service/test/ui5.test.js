const fs = require('fs');
const path = require('path');

describe('basics', () => {
    const selectorCookieAccept = {
        selector: {
            id: '__button4',
            controlType: 'sap.m.Button'
        }
    };

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

    it('should accept the cookies', () => {
        const buttonCookieAccept = browser.asControl(selectorCookieAccept);
        buttonCookieAccept.firePress();
    });

    it('should have the right title', () => {
        const title = browser.getTitle();
        expect(title).toEqual('Home - Demo Kit - SAPUI5 SDK');
    });

    it('should find a ui5 control by id', () => {
        const controlDownloadButton = browser.asControl(selectorDownloadButton);
        expect(controlDownloadButton.getText()).toEqual('Download');
    });

    it('should click a ui5 button (version selector) by id', () => {
        // open the dialog

        const controlVersionButton = browser.asControl(selectorVersionButton);
        controlVersionButton.firePress();

        // dialog
        const selectorList = {
            selector: {
                id: 'versionList',
                controlType: 'sap.m.List'
            }
        };

        // check for visibility
        expect(browser.asControl(selectorList).getVisible()).toBeTruthy();
    });
});

describe('screenshots', () => {
    it('should validate screenshots capability', () => {
        browser.screenshot('ui5-sdk-page');
        const screenShotPath = path.join('wdio-ui5-service', 'test', 'report', 'screenshots');
        const screenshots = fs.readdirSync(screenShotPath);
        const ours = screenshots.find((shot) => shot.match(/.*ui5-sdk-page.*/));
        expect(ours).toMatch(/.*ui5-sdk-page.*/);
    });
});
