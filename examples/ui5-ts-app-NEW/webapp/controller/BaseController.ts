import Controller from "sap/ui/core/mvc/Controller"
import History from "sap/ui/core/routing/History"
import UIComponent from "sap/ui/core/UIComponent"
import Router from "sap/ui/core/routing/Router"
import Model from "sap/ui/model/Model"
import ResourceModel from "sap/ui/model/resource/ResourceModel"
import ResourceBundle from "sap/base/i18n/ResourceBundle"

/**
 * @namespace test.Sample.controller
 */
export default class BaseController extends Controller {
    /**
     * inits on controller instantiation
     */
    public onInit(): void {}

    /**
     * Convenience method for accessing the router in every controller of the application.
     * @public
     * @returns the router for this component
     */
    public getRouter(): Router {
        return (this.getOwnerComponent() as UIComponent).getRouter()
    }

    /**
     * Convenience method for getting the view model by name in every controller of the application.
     * @public
     * @param {string} sName the model name
     * @returns the model instance
     */
    public getModel(sName?: string): Model {
        return this.getView()!.getModel(sName) as Model
    }

    /**
     * Convenience method for getting the resource bundle.
     * @public
     * @returns the resourceModel of the component
     */
    public getResourceBundle(): ResourceBundle | Promise<ResourceBundle> {
        return ((this.getOwnerComponent() as UIComponent).getModel("i18n") as ResourceModel).getResourceBundle()
    }

    /**
     * Event handler for navigating back.
     * It there is a history entry we go one step back in the browser history
     * If not, it will replace the current entry of the browser history with the master route.
     * @public
     */
    public onNavBack(): void {
        const sPreviousHash = History.getInstance().getPreviousHash()

        if (sPreviousHash !== undefined) {
            // eslint-disable-next-line
            history.go(-1)
        } else {
            this.getRouter().navTo("RouteMain", {}, true)
        }
    }
}
