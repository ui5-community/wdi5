describe('ui5 basic', () => {
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

    beforeEach(() => {
        browser.screenshot('test-ui5');
    });

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
