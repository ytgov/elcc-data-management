import path from "path"
import * as dotenv from "dotenv"

export const NODE_ENV = process.env.NODE_ENV || "development"

let dotEnvPath
switch (process.env.NODE_ENV) {
  case "test":
    dotEnvPath = path.resolve(__dirname, "../.env.test")
    break
  case "production":
    dotEnvPath = path.resolve(__dirname, "../.env.production")
    break
  default:
    dotEnvPath = path.resolve(__dirname, "../.env.development")
}

dotenv.config({ path: dotEnvPath })

if (process.env.NODE_ENV !== "test") {
  console.log("Loading env: ", dotEnvPath)
}

export const API_PORT = process.env.API_PORT || "3000"

export const VUE_APP_FRONTEND_URL = process.env.VUE_APP_FRONTEND_URL || ""
export const AUTH0_DOMAIN = (process.env.AUTH0_DOMAIN || "").replace(/\/$/, "")
export const AUTH0_AUDIENCE = process.env.VUE_APP_AUTH_AUDIENCE
export const AUTH_REDIRECT = process.env.AUTH_REDIRECT || process.env.FRONTEND_URL || ""

export const APPLICATION_NAME = process.env.APPLICATION_NAME || ""

export const DB_HOST = process.env.DB_HOST || ""
export const DB_USER = process.env.DB_USER || ""
export const DB_PASS = process.env.DB_PASS || ""
export const DB_NAME = process.env.DB_NAME || ""
export const DB_PORT = parseInt(process.env.DB_PORT || "1433")
