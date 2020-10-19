
describe('ui5 basic', () => {

    const selectorDownloadButton = {
        selector: {
            id: "readMoreButton",
            controlType: 'sap.m.Button',
            viewName: "sap.ui.documentation.sdk.view.Welcome"
        }
    };

    const selectorVersionButton = {
        selector: {
            id: 'changeVersionButton',
            controlType: "sap.m.Button",
            viewName: "sap.ui.documentation.sdk.view.App"
        }
    }

    const selectorAPIButton = {
        selector: {
            id: "apiMasterTab",
            controlType: "sap.m.IconTabFilter",
            viewName: "sap.ui.documentation.sdk.view.App"
        }
    }

    beforeEach(() => {
        browser.screenshot('test-ui5');
    });

    it('should have the right title', () => {
        const title = browser.getTitle();
        expect(title).toEqual('Home - Demo Kit - SAPUI5 SDK');
    });

    it('should find a ui5 control by id', () => {
        const controlDownloadButton = browser.asControl(selectorDownloadButton);
        expect(controlDownloadButton.getText()).toEqual("Download");
    });

    it('should click a ui5 button by id', () => {
        // open the dialog
        const controlAPIButton = browser.asControl(selectorAPIButton);
        /*controlAPIButton.fireSelect({
            getParameters: () => {
                return { key: "api" }
            }
        });*/
        controlAPIButton.getWebElement().click();

        // dialog
        const selectorText = {
            selector: {
                id: "landingImageHeadline",
                controlType: "sap.m.Text",
                viewName: "sap.ui.documentation.sdk.view.ApiDetailInitial"
            }
        }

        // check for visibility
        expect(browser.asControl(selectorText).getVisible()).toBeTruthy()
    });

    it('should click a ui5 buttin by id', () => {
        // open the dialog

        const controlVersionButton = browser.asControl(selectorVersionButton);
        controlVersionButton.firePress();

        // dialog
        const selectorList = {
            selector: {
                id: 'versionList',
                controlType: "sap.m.List"
            }
        }

        // check for visibility
        expect(browser.asControl(selectorList).getVisible()).toBeTruthy();
    });


});
