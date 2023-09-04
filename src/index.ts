import Launcher from "./launcher.js"
import Service from "./service.js"
import { wdi5 as _wdi5 } from "./wdi5.js"
import * as dotenv from "dotenv"
dotenv.config()

export default Service
export const launcher = Launcher
export const wdi5 = _wdi5
export * from "./types/browser-commands.js"
export * from "./types/wdi5.types.js"
