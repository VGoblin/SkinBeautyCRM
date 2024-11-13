import { combineReducers } from "redux"
import customizer from "./customizer/"
import auth from "./auth"
import navbar from "./navbar/Index"
import customer from "./customer"
import sessions from "./sessions"
import bodyarea from "./bodyarea"
import basicquestions from "./basicquestions"
import mediahistory from "./mediahistory"
import client from "./client"

const rootReducer = combineReducers({
  customizer: customizer,
  auth: auth,
  navbar: navbar,
  customer: customer,
  bodyarea: bodyarea,
  basicquestions: basicquestions,
  mediahistory: mediahistory,
  client : client,
  sessions : sessions
})

export default rootReducer
