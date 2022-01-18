const {selectorList, selectorCookieAccept} = require('./_selectorList');

describe('locate ui5 control via regex', () => {
    before(async () => {
        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            selectorCookieAccept.forceSelect = true;
            selectorCookieAccept.selector.interaction = 'root';
            selectorList.forceSelect = true;
            selectorList.selector.interaction = 'root';
        }

        if ((await browser.getUI5VersionAsFloat()) > 1.6) {
            const buttonCookieAccept = await browser.asControl(selectorCookieAccept);
            await buttonCookieAccept.firePress();
        }
    });

    it('should find the "change version" button by both property text regex options', async () => {
        const selectorByTextRegex = {
            selector: {
                controlType: 'sap.m.Button',
                properties: {
                    text: new RegExp(/.*ersi.*/gm)
                }
            }
        };

        const textViaPropertyRegEx = await browser.asControl(selectorByTextRegex).getText();
        expect(textViaPropertyRegEx).toEqual('Change Version');

        const selectorByDeclarativeRegex = {
            selector: {
                controlType: 'sap.m.Button',
                properties: {
                    text: {
                        regex: {
                            source: '.*ersi.*',
                            flags: 'gm'
                        }
                    }
                }
            }
        };
        const textViaDeclarative = await browser.asControl(selectorByDeclarativeRegex).getText();
        expect(textViaDeclarative).toEqual('Change Version');
    });

    /**
     * click the version list button to open a popup on the sdk site
     * then close it via "esc" key
     * @param {String|RegExp} idRegex
     */
    async function _assert(idRegex) {
        const selector = {
            forceSelect: true, // make sure we're retrieving from scratch
            selector: {
                id: idRegex
            }
        };

        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            selector.forceSelect = true;
            selector.selector.interaction = 'root';
        }

        const button = await browser.asControl(selector);
        await button.firePress();
        const list = await browser.asControl(selectorList);
        await expect(await list.getVisible()).toBeTruthy();

        await browser.keys('Escape'); // close popup
    }
    it('plain regex /.../', async () => {
        return await _assert(/.*changeVersionButton$/);
    });

    it('plain regex + flags /.../gmi', async () => {
        return await _assert(/.*changeVersionButton$/gim);
    });
    it('new RegEx(/.../flags)', async () => {
        return await _assert(new RegExp(/.*changeVersionButton$/));
    });

    it('new RegEx(/.../flags)', async () => {
        return await _assert(new RegExp(/.*changeVersionButton$/gi));
    });

    it('new RegEx("string")', async () => {
        return await _assert(new RegExp('.*changeVersionButton$'));
    });

    it('new RegEx("string", "flags")', async () => {
        return await _assert(new RegExp('.*changeVersionButton$', 'gmi'));
    });

    it('regex shorthand matchers are handled properly', async () => {
        return await _assert(/.*change\w.*Button$/);
    });
});
