sap.ui.define(
    [
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "test/Sample/model/models",
        "sap/ui/core/ComponentSupport" // make sure to include the ComponentSupport in the bundle
    ],
    function (UIComponent, Device, models) {
        "use strict"

        return UIComponent.extend("test.Sample.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments)

                // enable routing
                this.getRouter().initialize()

                // set the device model
                this.setModel(models.createDeviceModel(), "device")

                const url = new URL(location.href)
                if (url.searchParams.get("isui5toolingTest")?.toLocaleLowerCase() === "true") {
                    const startXHR = () => {
                        this.getModel().read("/Categories", {
                            success: startXHR
                        })
                    }
                    startXHR()
                    const startFetch = () => {
                        fetch("/V2/Northwind/Northwind.svc/Categories").then(startFetch)
                    }
                    startFetch()
                }
            }
        })
    }
)
