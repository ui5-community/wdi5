const {selectorList, selectorDownloadButton, selectorVersionButton, selectorCookieAccept} = require('./_selectorList');

describe('basics (async tests)', () => {
    before(async () => {
        if ((await browser.getUI5VersionAsFloat()) > 1.6) {
            const buttonCookieAccept = await browser.asControl(selectorCookieAccept);
            await buttonCookieAccept.firePress();
        }

        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            selectorCookieAccept.forceSelect = true;
            selectorCookieAccept.selector.interaction = 'root';
            selectorList.forceSelect = true;
            selectorList.selector.interaction = 'root';

            selectorDownloadButton.forceSelect = true;
            selectorDownloadButton.selector.interaction = 'root';

            selectorVersionButton.forceSelect = true;
            selectorVersionButton.selector.interaction = 'root';

            selectorList.forceSelect = true;
            selectorList.selector.interaction = 'root';
        }
    });

    it('should not report an error on successful $control.focus()', async () => {
        const selectorVersionButtonControl = await browser.asControl(selectorVersionButton);
        const focusResult = await selectorVersionButtonControl.focus();
        /* expect(focusResult).toBeTruthy(); */
        await expect(selectorVersionButtonControl.focus()).toBeTruthy();

        // assert focus on element also via webdriver.io api
        const wdFocusResult = await focusResult.getWebElement();
        // expect(await wdFocusResult.isFocused()).toBeTruthy();
        await expect(wdFocusResult.isFocused()).toBeTruthy();
    });

    it('should have the right title', async () => {
        const title = await browser.getTitle();

        if ((await browser.getUI5VersionAsFloat()) > 1.6) {
            expect(title).toEqual('Demo Kit - OPENUI5 SDK');
        } else {
            expect(title).toEqual('OpenUI5 SDK - Demo Kit v2.0');
        }
    });

    it('should find a ui5 control by id with async method chaning', async () => {
        expect(await (await browser.asControl(selectorDownloadButton)).getText()).toEqual('Download');
    });

    it('should get the parent control', async () => {
        const controlVersionButton = await browser.asControl(selectorVersionButton);
        const headerToolbar = await controlVersionButton.getParent();

        await expect(await headerToolbar.getVisible()).toBeTruthy();
        await expect(await headerToolbar.getId()).toStrictEqual('sdk---app--headerToolbar');
    });

    it('should click a ui5 button (version selector) by id', async () => {
        // open the version select dialog
        const controlVersionButton = await browser.asControl(selectorVersionButton);
        await controlVersionButton.firePress();

        // check for visibility
        const list = await browser.asControl(selectorList);
        expect(await list.getVisible()).toBeTruthy();

        await browser.keys('Escape'); // close popup
    });

    it("should check the length of the ui5 sdk site's version list without getting all subcontrols of aggregation", async () => {
        // open the version select dialog
        const controlVersionButton = await browser.asControl(selectorVersionButton);
        await controlVersionButton.firePress();

        const list = await browser.asControl(selectorList);
        const items = await list.getItems(true); // new param

        // not closing because of minor trouble with ui5 when closing opening this popup
        // browser.keys('Escape'); // close popup

        // check for number
        await expect(items.length).toBeGreaterThanOrEqual(54); // V1.91.0
    });

    it("should retieve the second control of the ui5 sdk site's version list without getting all subcontrols of aggregation", async () => {
        // open the version select dialog
        const controlVersionButton = await browser.asControl(selectorVersionButton);
        await controlVersionButton.firePress();

        const list = await browser.asControl(selectorList);
        const item3 = await list.getItems(3); // new param

        // not closing because of minor trouble with ui5 when closing opening this popup
        // browser.keys('Escape'); // close popup

        // check for number
        const number = await item3.getTitle();
        expect(parseFloat(number)).toBeGreaterThanOrEqual(parseFloat('1.85')); // once was v1.85.2
    });

    it('should find a control w/o id locator', async () => {
        const selectorWithoutId = {
            selector: {
                viewName: 'sap.ui.documentation.sdk.view.Welcome',
                controlType: 'sap.m.Button',
                properties: {
                    text: 'Get Started with UI5'
                }
            }
        };

        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            selectorWithoutId.forceSelect = true;
            selectorWithoutId.selector.interaction = 'root';
        }

        expect(await (await browser.asControl(selectorWithoutId)).getText()).toBe('Get Started with UI5');
    });

    it('should expect an non-existing control also not no have $control.focus', async () => {
        let noControl = {};
        try {
            noControl = await browser.asControl({selector: {id: 'doesnt_exist'}});
        } catch (error) {}
        expect(noControl.focus).toBeUndefined();
    });

    it('should navigate', async () => {
        if ((await browser.getUI5VersionAsFloat()) > 1.6) {
            await browser.setUrl('api/sap.m.Button');
            var header = await browser.asControl({
                selector: {id: 'title', viewName: 'sap.ui.documentation.sdk.view.SubApiDetail'}
            });
        } else {
            await browser.goTo('#/api/sap.m.Button');
            var header = await browser.asControl({selector: {id: '__xmlview5--title'}});
        }

        // direct call
        await expect(await header.getVisible()).toBeTruthy();
    });

    it('should navigate via hash', async () => {
        if ((await browser.getUI5VersionAsFloat()) > 1.6) {
            await browser.goTo('#events/Summary');
            var eventsHeader = await browser.asControl({
                selector: {id: 'events', viewName: 'sap.ui.documentation.sdk.view.SubApiDetail'}
            });
        } else {
            await browser.goTo('events/Summary');
            var eventsHeader = await browser.asControl({selector: {id: '__xmlview6--events'}});
        }

        await expect(await eventsHeader.getVisible()).toBeTruthy();
    });
});
