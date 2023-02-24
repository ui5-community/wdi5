import BaseController from "./BaseController"

/**
 * @namespace test.Sample.tsapp.controller
 */
export default class Main extends BaseController {
    navFwd(): any {
        //@ts-expect-error routing not known yet
        this.routing.navigateToRoute("RouteOther")
    }

    async asyncFn(): Promise<number> {
        return new Promise((resolve) => {
            resolve(10)
        })
    }
    async asyncRejectFn(): Promise<number> {
        return new Promise((resolve, reject) => {
            reject("meh")
        })
    }
}
