import Launcher from "./launcher"
import Service from "./service"
import { wdi5 as _wdi5 } from "./wdi5"
import * as dotenv from "dotenv"
dotenv.config()

export default Service
export const launcher = Launcher
export const wdi5 = _wdi5
export * from "./types/browser-commands"
