import BaseController from "./BaseController"
import oDataModel from "sap/ui/model/odata/v2/ODataModel"

/**
 * @namespace test.Sample.tsapp.controller
 */
export default class Main extends BaseController {
    onInit(): void {
        ;(this.getOwnerComponent().getModel() as oDataModel).read("/Customers('TRAIH')")
    }

    navFwd(): any {
        return this.getOwnerComponent().getRouter().navTo("RouteOther")
    }
}
