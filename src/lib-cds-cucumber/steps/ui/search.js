/**
 * @module Search
 * @memberof UI
 */

const { When } = require("@cucumber/cucumber")

/**
 * @name When we search for {string}
 * @description Performs a basic search for the specified text in the current ListReport
 * @param {string} text text to search for
 * @example When we search for "jane"
 */
When("we search for {string}", async function (text) {
    //await this.controller.performBasicSearch(text);
    await this.controller.editSearchField(text)
    await this.controller.waitEvents()
    await this.controller.applySearchFilter()
    await this.controller.waitToLoad()
})

/**
 * @name When we enter in the search field {string}
 * @description Enters the specified text in the basic search field of a ListReport
 * @param {string} text text to enter in the search field
 * @example When we enter in the search field "jane"
 */
When("we enter in the search field {string}", async function (text) {
    await this.controller.editSearchField(text)
    await this.controller.waitEvents()
})

/**
 * @name When we apply the search filter
 * @description Performs a basic search in the current ListReport
 * @example When we apply the search filter
 */
When("we apply the search filter", async function () {
    await this.controller.applySearchFilter()
    await this.controller.waitToLoad()
})
