export function isMultiRemote(browserInstance: WebdriverIO.Browser | WebdriverIO.MultiRemoteBrowser): boolean {
    // v10 renamed isMultiremote to isMultiRemote without an alias
    const flags = browserInstance as unknown as { isMultiremote?: boolean; isMultiRemote?: boolean }
    return flags.isMultiRemote === true || flags.isMultiremote === true
}
