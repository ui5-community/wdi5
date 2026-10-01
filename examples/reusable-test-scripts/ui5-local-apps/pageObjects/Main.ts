import Page from "./Page.js"

class Main extends Page {
    _viewName = "test.Sample.view.Main"

    async open() {
        await super.open(`#/Main`)
    }

    async getTitle() {
        return await browser.asControl({
            selector: {
                id: "Title::NoAction.h1",
                viewName: this._viewName
            }
        })
    }

    async getNavFwdButton() {
        return await browser.asControl({
            selector: {
                id: "NavFwdButton",
                viewName: this._viewName
            }
        })
    }

    async getNavFwdButtonDisabled() {
        return await browser.asControl({
            selector: {
                id: "NavFwdButtonDisabled",
                viewName: this._viewName
            }
        })
    }

    async getNavCalendarButton() {
        return await browser.asControl({
            selector: {
                id: "NavCalendarButton",
                viewName: this._viewName
            }
        })
    }

    async getUserTestButton() {
        return await browser.asControl({
            selector: {
                id: "user-test-button",
                viewName: this._viewName
            }
        })
    }

    async getIaSyncButton() {
        return await browser.asControl({
            selector: {
                id: "idIaSync",
                viewName: this._viewName
            }
        })
    }

    async getMainUserInput() {
        return await browser.asControl({
            wdio_ui5_key: "mainUserInput",
            selector: {
                id: "mainUserInput",
                viewName: this._viewName,
                controlType: "sap.m.Input"
            }
        })
    }

    async getDateTimePicker() {
        return await browser.asControl({
            selector: {
                id: "idDateTime",
                viewName: this._viewName
            }
        })
    }

    async getTestModelButton() {
        return await browser.asControl({
            wdio_ui5_key: "buttonSelector",
            selector: {
                interaction: "focus",
                bindingPath: {
                    modelName: "testModel",
                    propertyPath: "/buttonText"
                },
                viewName: this._viewName,
                controlType: "sap.m.Button"
            }
        })
    }

    async getTestModelInput() {
        return await browser.asControl({
            wdio_ui5_key: "inputSelector",
            selector: {
                interaction: "focus",
                bindingPath: {
                    modelName: "testModel",
                    propertyPath: "/inputValue"
                },
                viewName: this._viewName,
                controlType: "sap.m.Input"
            }
        })
    }

    async getCheckbox() {
        return await browser.asControl({
            wdio_ui5_key: "cbSelector1",
            selector: {
                id: "idCheckbox",
                viewName: this._viewName,
                controlType: "sap.m.CheckBox"
            }
        })
    }

    async getBarcodeScannerButton() {
        return await browser.asControl({
            selector: {
                id: "barcodescannerplugin",
                viewName: this._viewName
            }
        })
    }

    async getBarcodeValueInput() {
        return await browser.asControl({
            selector: {
                id: "barcodeValue",
                viewName: this._viewName
            }
        })
    }

    async getOpenDialogButton() {
        return await browser.asControl({
            selector: {
                id: "openDialogButton",
                viewName: this._viewName
            }
        })
    }

    async getDialog() {
        return await browser.asControl({
            forceSelect: true,
            selector: {
                id: "Dialog",
                controlType: "sap.m.Dialog",
                interaction: "root"
            }
        })
    }

    async getComboBox() {
        return await browser.asControl({
            forceSelect: true,
            selector: {
                interaction: "root",
                id: "combobox",
                viewName: this._viewName
            }
        })
    }

    async getMultiComboBox() {
        return await browser.asControl({
            selector: {
                id: "multiComboBox",
                viewName: this._viewName
            }
        })
    }

    async getSearchField() {
        return await browser.asControl({
            selector: {
                id: "idSearchfield",
                viewName: this._viewName
            }
        })
    }

    async getSearchResult() {
        return await browser.asControl({
            selector: {
                id: "idSearchResult",
                viewName: this._viewName
            }
        })
    }

    async getKeepFocusInput() {
        return await browser.asControl({
            selector: {
                id: "idKeepFocusInput",
                viewName: this._viewName
            }
        })
    }

    async getKeepFocusResult() {
        return await browser.asControl({
            selector: {
                id: "idKeepFocusResult",
                viewName: this._viewName
            }
        })
    }

    async getClearTextInput() {
        return await browser.asControl({
            selector: {
                id: "idClearTextInput",
                viewName: this._viewName
            }
        })
    }

    async getClearTextResult() {
        return await browser.asControl({
            selector: {
                id: "idClearTextResult",
                viewName: this._viewName
            }
        })
    }

    async getSelect() {
        return await browser.asControl({
            selector: {
                id: "select",
                viewName: this._viewName
            }
        })
    }

    async getAllButtons(force = false) {
        return await browser.allControls({
            wdio_ui5_key: "allButtons",
            forceSelect: force,
            selector: {
                controlType: "sap.m.Button",
                viewName: this._viewName
            }
        })
    }
}

export default new Main()
