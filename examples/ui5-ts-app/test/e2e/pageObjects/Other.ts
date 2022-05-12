import Page from "./Page"
// allNames = [
//     "Nancy Davolio",
//     "Andrew Fuller",
//     "Janet Leverling",
//     "Margaret Peacock",
//     "Steven Buchanan",
//     "Michael Suyama",
//     "Robert King",
//     "Laura Callahan",
//     "Anne Dodsworth"
// ]
export class Other extends Page {
    async open() {
        await super.open(`#/Other`)
    }
}
