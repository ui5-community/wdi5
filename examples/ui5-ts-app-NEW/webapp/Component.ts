import UIComponent from "sap/ui/core/UIComponent"
import "sap/ui/core/ComponentSupport" // make sure to include the ComponentSupport in the bundle
import models from "./model/models"
import ODataModel from "sap/ui/model/odata/v2/ODataModel"

/**
 * @namespace test.Sample
 */
export default class Component extends UIComponent {
    static readonly metadata = {
        manifest: "json"
    }

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    public init(): void {
        // call the base component's init function
        super.init()

        // enable routing
        this.getRouter().initialize()

        // set the device model
        this.setModel(models.createDeviceModel(), "device")

        const url = new URL(location.href)
        if (url.searchParams.get("isui5toolingTest")?.toLocaleLowerCase() === "true") {
            const startXHR = () => {
                ;(this.getModel() as ODataModel).read("/Categories", {
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
}
