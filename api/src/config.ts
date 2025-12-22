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
export const DB_TRUST_SERVER_CERTIFICATE = process.env.DB_TRUST_SERVER_CERTIFICATE === "true"

export const DB_HEALTH_CHECK_INTERVAL_SECONDS = parseInt(
  process.env.DB_HEALTH_CHECK_INTERVAL_SECONDS || "5"
)
export const DB_HEALTH_CHECK_TIMEOUT_SECONDS = parseInt(
  process.env.DB_HEALTH_CHECK_TIMEOUT_SECONDS || "10"
)
export const DB_HEALTH_CHECK_RETRIES = parseInt(process.env.DB_HEALTH_CHECK_RETRIES || "3")
export const DB_HEALTH_CHECK_START_PERIOD_SECONDS = parseInt(
  process.env.DB_HEALTH_CHECK_START_PERIOD_SECONDS || "5"
)

export const RELEASE_TAG = process.env.RELEASE_TAG || ""
export const GIT_COMMIT_HASH = process.env.GIT_COMMIT_HASH || ""

export const AWS_LOGGING_ENABLED = process.env.AWS_LOGGING_ENABLED || "false"
export const AWS_LOGGING_GROUP = process.env.AWS_LOGGING_GROUP || ""
export const AWS_LOGGING_STREAM = process.env.AWS_LOGGING_STREAM || ""
export const AWS_LOGGING_REGION = process.env.AWS_LOGGING_REGION || "ca-central-1"
export const AWS_LOGGING_ACCESS_ID = process.env.AWS_LOGGING_ACCESS_ID || ""
export const AWS_LOGGING_ACCESS_KEY = process.env.AWS_LOGGING_ACCESS_KEY || ""
export const DEFAULT_LOG_LEVEL = process.env.DEFAULT_LOG_LEVEL || "debug"
