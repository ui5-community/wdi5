import { clientSide_testLibrary } from "../../client-side-js/testLibrary"

export class WDI5FE {
    ListReport = {}

    constructor(appConfig) {
        this.ListReport = appConfig.ListReport
    }

    onFilterBar() {
        return this
    }

    async iExecuteSearch() {
        await clientSide_testLibrary("ListReport", ["onFilterBar", "iExecuteSearch"], this.ListReport)
    }
}
