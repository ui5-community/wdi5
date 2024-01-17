import * as dotenv from "dotenv"
import Launcher from "./launcher.js"
import Service from "./service.js"
import { wdi5 as _wdi5 } from "./wdi5.js"
dotenv.config()

export default Service
export const launcher = Launcher
export const wdi5 = _wdi5
export { ELEMENT_KEY } from "./lib/wdi5-control.js"
export * from "./types/browser-commands.js"
export * from "./types/wdi5.types.js"
