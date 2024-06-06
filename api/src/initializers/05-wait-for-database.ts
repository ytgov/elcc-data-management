import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER, NODE_ENV } from "@/config"
import { Sequelize } from "sequelize"

const INTERVAL_SECONDS = 5
const TIMEOUT_SECONDS = 5
const RETRIES = 3
const START_PERIOD_SECONDS = 10

function checkHealth(db: Sequelize, timeoutSeconds: number) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Connection timeout")), timeoutSeconds * 1000)
    db.authenticate()
      .then(() => {
        clearTimeout(timer)
        resolve(null)
      })
      .catch(reject)
  })
}

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export async function waitForDatabase({
  intervalSeconds = INTERVAL_SECONDS,
  timeoutSeconds = TIMEOUT_SECONDS,
  retries = RETRIES,
  startPeriodSeconds = NODE_ENV === "test" ? 0 : START_PERIOD_SECONDS,
}: {
  intervalSeconds?: number
  timeoutSeconds?: number
  retries?: number
  startPeriodSeconds?: number
} = {}): Promise<void> {
  let username: string
  let database: string
  if (
    NODE_ENV === "production" &&
    process.env.PRODUCTION_DATABASE_SA_MASTER_CREDS_AVAILABLE !== "true"
  ) {
    console.info(
      "Falling back to local database credentials because production database sa:master credentials are not available."
    )
    username = DB_USER
    database = DB_NAME
  } else {
    username = "sa" // default user that should always exist
    database = "master" // default database that should always exist
  }

  const db = new Sequelize({
    dialect: "mssql",
    username,
    database,
    password: DB_PASS,
    host: DB_HOST,
    port: DB_PORT,
    schema: "dbo",
    logging: NODE_ENV === "development" ? console.log : false,
  })

  await sleep(startPeriodSeconds)

  for (let i = 0; i < retries; i++) {
    try {
      await checkHealth(db, timeoutSeconds)
      console.log("Database connection successful.")
      return
    } catch (error) {
      console.warn("Database connection failed, retrying...", error)
      await sleep(intervalSeconds)
    }
  }
  throw new Error("Failed to connect to the database after retries.")
}

export default waitForDatabase
