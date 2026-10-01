import BaseController from "./BaseController"
import JSONModel from "sap/ui/model/json/JSONModel"
import MessageBox from "sap/m/MessageBox"
import PlanningCalendar from "sap/m/PlanningCalendar"
import MultiComboBox from "sap/m/MultiComboBox"
import { PlanningCalendar$AppointmentSelectEvent } from "sap/m/PlanningCalendar"
import { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox"
import CalendarAppointment from "sap/ui/unified/CalendarAppointment"

/**
 * @namespace test.Sample.controller
 */
export default class Calendar extends BaseController {
    public onInit(): void {
        // create model
        const oModel = new JSONModel()
        oModel.setData({
            startDate: new Date(2017, 0, 15, 8, 0),
            people: [
                {
                    pic: "sap-icon://employee",
                    name: "John Miller",
                    role: "team member",
                    appointments: [
                        {
                            start: new Date(2017, 0, 8, 8, 30),
                            end: new Date(2017, 0, 8, 9, 30),
                            title: "Meet Max Mustermann",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 11, 10, 0),
                            end: new Date(2017, 0, 11, 12, 0),
                            title: "Team meeting",
                            info: "room 1",
                            type: "Type01",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 12, 11, 30),
                            end: new Date(2017, 0, 12, 13, 30),
                            title: "Lunch",
                            info: "canteen",
                            type: "Type03",
                            tentative: true
                        },
                        {
                            start: new Date(2017, 0, 15, 8, 30),
                            end: new Date(2017, 0, 15, 9, 30),
                            title: "Meet Max Mustermann",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 15, 10, 0),
                            end: new Date(2017, 0, 15, 12, 0),
                            title: "Team meeting",
                            info: "room 1",
                            type: "Type01",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 15, 11, 30),
                            end: new Date(2017, 0, 15, 13, 30),
                            title: "Lunch",
                            info: "canteen",
                            type: "Type03",
                            tentative: true
                        },
                        {
                            start: new Date(2017, 0, 15, 13, 30),
                            end: new Date(2017, 0, 15, 17, 30),
                            title: "Discussion with clients",
                            info: "online meeting",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 16, 4, 0),
                            end: new Date(2017, 0, 16, 22, 30),
                            title: "Discussion of the plan",
                            info: "Online meeting",
                            type: "Type04",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 18, 8, 30),
                            end: new Date(2017, 0, 18, 9, 30),
                            title: "Meeting with the manager",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 18, 11, 30),
                            end: new Date(2017, 0, 18, 13, 30),
                            title: "Lunch",
                            info: "canteen",
                            type: "Type03",
                            tentative: true
                        },
                        {
                            start: new Date(2017, 0, 18, 1, 0),
                            end: new Date(2017, 0, 18, 22, 0),
                            title: "Team meeting",
                            info: "regular",
                            type: "Type01",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 21, 0, 30),
                            end: new Date(2017, 0, 21, 23, 30),
                            title: "New Product",
                            info: "room 105",
                            type: "Type03",
                            tentative: true
                        },
                        {
                            start: new Date(2017, 0, 25, 11, 30),
                            end: new Date(2017, 0, 25, 13, 30),
                            title: "Lunch",
                            type: "Type03",
                            tentative: true
                        },
                        {
                            start: new Date(2017, 0, 29, 10, 0),
                            end: new Date(2017, 0, 29, 12, 0),
                            title: "Team meeting",
                            info: "room 1",
                            type: "Type01",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 30, 8, 30),
                            end: new Date(2017, 0, 30, 9, 30),
                            title: "Meet Max Mustermann",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 30, 10, 0),
                            end: new Date(2017, 0, 30, 12, 0),
                            title: "Team meeting",
                            info: "room 1",
                            type: "Type01",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 30, 11, 30),
                            end: new Date(2017, 0, 30, 13, 30),
                            title: "Lunch",
                            type: "Type03",
                            tentative: true
                        },
                        {
                            start: new Date(2017, 0, 30, 13, 30),
                            end: new Date(2017, 0, 30, 17, 30),
                            title: "Discussion with clients",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 31, 10, 0),
                            end: new Date(2017, 0, 31, 11, 30),
                            title: "Meeting of the day",
                            info: "Special meeting",
                            type: "Type04",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 1, 3, 8, 30),
                            end: new Date(2017, 1, 13, 9, 30),
                            title: "Meeting with the manager",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 1, 4, 10, 0),
                            end: new Date(2017, 1, 4, 12, 0),
                            title: "Team meeting",
                            info: "room 1",
                            type: "Type01",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 2, 30, 10, 0),
                            end: new Date(2017, 4, 33, 12, 0),
                            title: "Working out of the building",
                            type: "Type07",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        }
                    ],
                    headers: [
                        {
                            start: new Date(2017, 0, 15, 8, 0),
                            end: new Date(2017, 0, 15, 10, 0),
                            title: "Reminder",
                            type: "Type06"
                        },
                        {
                            start: new Date(2017, 0, 15, 17, 0),
                            end: new Date(2017, 0, 15, 19, 0),
                            title: "Reminder",
                            type: "Type06"
                        },
                        {
                            start: new Date(2017, 8, 1, 0, 0),
                            end: new Date(2017, 10, 30, 23, 59),
                            title: "New quarter",
                            type: "Type10",
                            tentative: false
                        },
                        {
                            start: new Date(2018, 1, 1, 0, 0),
                            end: new Date(2018, 3, 30, 23, 59),
                            title: "New quarter",
                            type: "Type10",
                            tentative: false
                        }
                    ]
                },
                {
                    pic: "sap-icon://employee",
                    name: "Donna Moore",
                    role: "team member",
                    appointments: [
                        {
                            start: new Date(2017, 0, 10, 18, 0),
                            end: new Date(2017, 0, 10, 19, 10),
                            title: "Meet and greet",
                            info: "Friends meeting",
                            type: "Type04",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 9, 10, 0),
                            end: new Date(2017, 0, 13, 12, 0),
                            title: "Workshop out of the country",
                            type: "Type07",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 15, 8, 0),
                            end: new Date(2017, 0, 15, 9, 30),
                            title: "Meet the plan",
                            info: "Live meeting",
                            type: "Type04",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 15, 10, 0),
                            end: new Date(2017, 0, 15, 12, 0),
                            title: "Team meeting",
                            info: "room 1",
                            type: "Type01",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 15, 18, 0),
                            end: new Date(2017, 0, 15, 19, 10),
                            title: "Discussion of the plan",
                            info: "Online meeting",
                            type: "Type04",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 16, 10, 0),
                            end: new Date(2017, 0, 31, 12, 0),
                            title: "Workshop out of the country",
                            type: "Type07",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2018, 0, 1, 0, 0),
                            end: new Date(2018, 2, 31, 23, 59),
                            title: "New quarter",
                            type: "Type10",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 1, 11, 10, 0),
                            end: new Date(2017, 2, 20, 12, 0),
                            title: "Team collaboration",
                            info: "room 1",
                            type: "Type01",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 3, 1, 10, 0),
                            end: new Date(2017, 3, 31, 12, 0),
                            title: "Workshop out of the country",
                            type: "Type07",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 4, 1, 10, 0),
                            end: new Date(2017, 4, 31, 12, 0),
                            title: "Out of the office",
                            type: "Type08",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 7, 1, 0, 0),
                            end: new Date(2017, 7, 31, 23, 59),
                            title: "Vacation",
                            info: "out of office",
                            type: "Type04",
                            tentative: false
                        }
                    ],
                    headers: [
                        {
                            start: new Date(2017, 0, 15, 9, 0),
                            end: new Date(2017, 0, 15, 10, 0),
                            title: "Payment reminder",
                            type: "Type06"
                        },
                        {
                            start: new Date(2017, 0, 15, 16, 30),
                            end: new Date(2017, 0, 15, 18, 0),
                            title: "Private appointment",
                            type: "Type06"
                        }
                    ]
                },
                {
                    pic: "sap-icon://employee",
                    name: "Max Mustermann",
                    role: "team member",
                    appointments: [
                        {
                            start: new Date(2017, 0, 15, 8, 30),
                            end: new Date(2017, 0, 15, 9, 30),
                            title: "Meet John Miller",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 15, 10, 0),
                            end: new Date(2017, 0, 15, 12, 0),
                            title: "Team meeting",
                            info: "room 1",
                            type: "Type01",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 15, 13, 0),
                            end: new Date(2017, 0, 15, 16, 0),
                            title: "Discussion with clients",
                            info: "online",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 16, 0, 0),
                            end: new Date(2017, 0, 16, 23, 59),
                            title: "Vacation",
                            info: "out of office",
                            type: "Type04",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 17, 1, 0),
                            end: new Date(2017, 0, 18, 22, 0),
                            title: "Workshop",
                            info: "regular",
                            type: "Type07",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 19, 8, 30),
                            end: new Date(2017, 0, 19, 18, 30),
                            title: "Meet John Doe",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 19, 10, 0),
                            end: new Date(2017, 0, 19, 16, 0),
                            title: "Team meeting",
                            info: "room 1",
                            type: "Type01",
                            pic: "sap-icon://sap-ui5",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 19, 7, 0),
                            end: new Date(2017, 0, 19, 17, 30),
                            title: "Discussion with clients",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 20, 0, 0),
                            end: new Date(2017, 0, 20, 23, 59),
                            title: "Vacation",
                            info: "out of office",
                            type: "Type04",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 0, 22, 7, 0),
                            end: new Date(2017, 0, 27, 17, 30),
                            title: "Discussion with clients",
                            info: "out of office",
                            type: "Type02",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 2, 13, 9, 0),
                            end: new Date(2017, 2, 17, 10, 0),
                            title: "Payment week",
                            type: "Type06"
                        },
                        {
                            start: new Date(2017, 3, 10, 0, 0),
                            end: new Date(2017, 5, 16, 23, 59),
                            title: "Vacation",
                            info: "out of office",
                            type: "Type04",
                            tentative: false
                        },
                        {
                            start: new Date(2017, 7, 1, 0, 0),
                            end: new Date(2017, 9, 31, 23, 59),
                            title: "New quarter",
                            type: "Type10",
                            tentative: false
                        }
                    ],
                    headers: [
                        {
                            start: new Date(2017, 0, 16, 0, 0),
                            end: new Date(2017, 0, 16, 23, 59),
                            title: "Private",
                            type: "Type05"
                        }
                    ]
                }
            ]
        })
        this.getView()!.setModel(oModel)
    }

    public handleAppointmentSelect(oEvent: PlanningCalendar$AppointmentSelectEvent): void {
        const oAppointment = oEvent.getParameter("appointment") as CalendarAppointment | undefined
        let sSelected: string
        if (oAppointment) {
            sSelected = oAppointment.getSelected() ? "selected" : "deselected"
            MessageBox.show(
                "'" +
                    oAppointment.getTitle() +
                    "' " +
                    sSelected +
                    ". \n Selected appointments: " +
                    (this.byId("PC1") as PlanningCalendar).getSelectedAppointments().length
            )
        } else {
            const aAppointments = oEvent.getParameter("appointments") as CalendarAppointment[]
            const sValue = aAppointments.length + " Appointments selected"
            MessageBox.show(sValue)
        }
    }

    public handleSelectionFinish(oEvent: MultiComboBox$SelectionFinishEvent): void {
        const aSelectedKeys = (oEvent.getSource() as MultiComboBox).getSelectedKeys()
        ;(this.byId("PC1") as PlanningCalendar).setBuiltInViews(aSelectedKeys)
    }
}
