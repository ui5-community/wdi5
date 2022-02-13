sap.ui.define(
    ['test/Sample/controller/BaseController', 'sap/m/MessageToast', 'sap/m/StandardListItem'],
    function (Controller, MessageToast, StandardListItem) {
        'use strict';

        return Controller.extend('test.Sample.controller.Other', {
            onInit: function () {},

            onItemPress(oEvent) {
                this.getView().byId('idTextFieldClickResult').setText(oEvent.getParameter('listItem').data('key'));

                MessageToast.show(oEvent.getParameter('listItem').data('key'));
            },

            onAddLineItem(oEvent) {
                this.getView()
                    .byId('PeopleList')
                    .addItem(
                        new StandardListItem({
                            title: 'FirstName LastName',
                            type: 'Navigation'
                        })
                    );
            }
        });
    }
);
