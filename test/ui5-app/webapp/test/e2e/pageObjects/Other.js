const Page = require('./Page');

class Other extends Page {
    allNames = [
        'Nancy Davolio',
        'Andrew Fuller',
        'Janet Leverling',
        'Margaret Peacock',
        'Steven Buchanan',
        'Michael Suyama',
        'Robert King',
        'Laura Callahan',
        'Anne Dodsworth'
    ];
    _viewName = 'test.Sample.view.Other';

    open(accountId) {
        super.open(`#/Other`);
    }

    getList(force = false) {
        const listSelector = {
            wdio_ui5_key: 'PeopleList',
            selector: {
                id: 'PeopleList',
                viewName: this._viewName
            },
            forceSelect: force //> this will populate down to $ui5Control.getAggregation and $ui5Control.getProperty as well
        };

        if (parseFloat(browser.getUI5Version()) <= 1.6) {
            listSelector.forceSelect = true;
            listSelector.selector.interaction = 'root';
        }

        return browser.asControl(listSelector);
    }

    getListItems(force = false) {
        return this.getList(force).getAggregation('items');
    }

    getAddLineItemButtom() {
        return browser.asControl({
            selector: {
                id: 'idAddLineItemButton',
                viewName: this._viewName
            }
        });
    }
}

module.exports = new Other();
