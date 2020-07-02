sap.ui.define(['test/Sample/controller/BaseController', 'sap/m/MessageToast', 'sap/ui/model/json/JSONModel'], function (
    Controller,
    MessageToast,
    JSONModel
) {
    'use strict';

    return Controller.extend('test.Sample.controller.Main', {
        onInit: function () {
            this.getOwnerComponent().getModel().read("/Customers('TRAIH')");

            const jData = {
                inputValue: 'test Input Value !!!',
                buttonText: "Don't press me !!! -> binded",
                checkbox: false,
                barcode: '',
                fingerprint: "not authenticated"
            };

            let testModel = new JSONModel(jData);
            this.getView().setModel(testModel, 'testModel');
        },

        navFwd: function () {
            return this.getOwnerComponent().getRouter().navTo('RouteOther');
        },

        onPress: function (oEvent) {
            MessageToast.show(`${oEvent.getSource().getId()} pressed`);
        },
        onBoo: function (oEvent) {
            MessageToast.show(`👻`);

            // fingerprint
            if (window.Fingerprint) {
                // android + ios
                var _self = this;

                /* window.Fingerprint.isAvailable((e) => {
                    // result depends on device and os.
                    console.log("Fingerprint available");
                }, (error) => {
                    // 'error' will be an object with an error code and message
                    console.log(error.message);
                }); */

                window.Fingerprint.show({
                    description: "Some biometric description"
                }, event => {
                    console.log("Authentication successful: " + event);
                    _self.getModel('testModel').setProperty("/fingerprint", "Authentication successful");
                    // alert("Authentication successful");
                }, error => {
                    console.log("Authentication invalid " + error.message);
                    _self.getModel('testModel').setProperty("/fingerprint", "Authentication invalid");
                    // alert("Authentication invalid");
                });
            } else {
                // browser + electron
                console.warn("Fingerprint not available")
            }
        },

        onTest: function (oEvent) {
            this.onBoo(oEvent);
        },
        onSelect: function (oEvent) {
            const selectedProperty = oEvent.getSource().getProperty('selected');
            const selectedParameter = oEvent.getParameter('selected');
            MessageToast.show(`selectedProperty: ${selectedProperty} selectedParameter: ${selectedParameter}`);
        },
        scanBarcode: function (oEvent) {
            if (cordova) {
                var _self = this;
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        // update in model
                        _self.getView().getModel('testModel').setProperty('/barcode', result.text);

                        MessageToast.show(
                            'We got a barcode\n' +
                            'Result: ' +
                            result.text +
                            '\n' +
                            'Format: ' +
                            result.format +
                            '\n' +
                            'Cancelled: ' +
                            result.cancelled
                        );
                    },
                    function (error) {
                        MessageToast.show('Scanning failed: ' + error);
                    }
                );
            }
        }
    });
});
