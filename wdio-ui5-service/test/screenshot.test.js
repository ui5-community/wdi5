const fs = require('fs');
const path = require('path');
const {selectorList, selectorCookieAccept} = require('./_selectorList');

describe('screenshots (async tests)', () => {
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
    it('should validate screenshots capability', async () => {
        await browser.screenshot('ui5-sdk-page');

        // seed to wait some time until the screenshot is actually saved to the file system before reading it again
        setTimeout(() => {
            const screenShotPath = path.join('wdio-ui5-service', 'test', 'report', 'screenshots');
            const screenshots = fs.readdirSync(screenShotPath);
            const ours = screenshots.find((shot) => shot.match(/.*ui5-sdk-page.*/));
            expect(ours).toMatch(/.*ui5-sdk-page.*/);
        }, 1500);
    });

    it('should validate screenshots capability with unnamed screenshot', async () => {
        await browser.screenshot();

        // seed to wait some time until the screenshot is actually saved to the file system before reading it again
        setTimeout(() => {
            const screenShotPath = path.join('wdio-ui5-service', 'test', 'report', 'screenshots');
            const screenshots = fs.readdirSync(screenShotPath);
            const ours = screenshots.find((shot) => shot.match(/.*-browser-screenshot.png/));
            expect(ours).toMatch(/.*-browser-screenshot.png/);
        }, 1500);
    });
});
