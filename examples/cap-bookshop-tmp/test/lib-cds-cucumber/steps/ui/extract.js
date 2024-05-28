/**
 * @module Extraction
 * @memberof UI
 */

const { When } = require("@cucumber/cucumber")

/**
 * @name When we get the title of the page
 * @description Extracts the title of the currently visible page and stores it for subsequent processing
 * @example When we get the title of the page
 */
When("we get the title of the page", async function () {
    this.result = await this.controller.getTitle()
})

/**
 * @name When we read the content
 * @description Extracts the content of the currently visible page and stores it for subsequent processing
 * @example When we read the content
 */
When("we read the content", async function () {
    this.result = await this.controller.extractCurrentPageContent()
})

/**
 * @name When we read the content of the page
 * @description Extracts the content of the currently visible object page and stores it for subsequent processing
 * @example When we read the content of the page
 */
When("we read the content of the page", async function () {
    this.result = await this.controller.extractObjectPageContent()
})

/**
* @name When we read the content of the page with bindings
* @description Extracts the content of the currently visible object page together with the field bingings
    and stores it for subsequent processing
* @example When we read the content of the page with bindings
*/
When("we read the content of the page with bindings", async function () {
    this.result = await this.controller.extractObjectPageContentWithBindingInfo()
})

/**
 * @name When we read the content of the rows in the table
 * @description Extracts the content of the currently visible ListReport and stores it for subsequent processing
 * @example When we read the content of the rows in the table
 */
When("we read the content of the rows in the table", async function () {
    this.result = await this.controller.extractTableRows()
})

/**
* @name When we read the content of the table with bindings
* @description Extracts the content of the currently visible ListReport together with the field bingings
    and stores it for subsequent processing
* @example When we read the content of the table with bindings
*/
When("we read the content of the table with bindings", async function () {
    this.result = await this.controller.extractTableContentWithBindingInfo()
})
