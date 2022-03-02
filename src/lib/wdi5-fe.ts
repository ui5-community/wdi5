import { clientSide_testLibrary } from "../../client-side-js/testLibrary"
import { Logger as _Logger } from "./Logger"
const Logger = _Logger.getInstance()

export class WDI5FE {
    ListReport = {}

    constructor(appConfig) {
        this.ListReport = appConfig.ListReport
    }

    onFilterBar() {
        return this
    }

    onTable() {
        return this
    }

    async iCheckRows() {
        const result = await clientSide_testLibrary("ListReport", ["onTable", "iCheckRows"], this.ListReport, true)
        if (result[0] === "error") {
            Logger.error(result[1])
            return false
        } else {
            Logger.success(result[1])
            return true
        }
    }

    async iExecuteSearch() {
        const result = await clientSide_testLibrary("ListReport", ["onFilterBar", "iExecuteSearch"], this.ListReport)
        if (result[0] === "error") {
            Logger.error(result[1])
            return false
        } else {
            Logger.success(result[1])
            return true
        }
    }
}
