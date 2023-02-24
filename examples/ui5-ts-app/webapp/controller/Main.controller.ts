import BaseController from "./BaseController"

/**
 * @namespace test.Sample.tsapp.controller
 */
export default class Main extends BaseController {
    navFwd(): any {
        //@ts-expect-error routing not known yet
        this.routing.navigateToRoute("RouteOther")
    }
}
