import { DB_HOST, DB_PASS, DB_PORT, NODE_ENV } from "@/config"
import { Sequelize } from "sequelize"

const db = new Sequelize({
  dialect: "mssql",
  username: "sa", // default user that should always exist
  database: "master", // default database that should always exist
  password: DB_PASS,
  host: DB_HOST,
  port: DB_PORT,
  schema: "dbo",
  logging: NODE_ENV === "development" ? console.log : false,
})

const INTERVAL_SECONDS = 5
const TIMEOUT_SECONDS = 5
const RETRIES = 3
const START_PERIOD_SECONDS = 10

function checkHealth(timeoutSeconds: number) {
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
  startPeriodSeconds = START_PERIOD_SECONDS,
}: {
  intervalSeconds?: number
  timeoutSeconds?: number
  retries?: number
  startPeriodSeconds?: number
} = {}): Promise<void> {
  await sleep(startPeriodSeconds)

  for (let i = 0; i < retries; i++) {
    try {
      await checkHealth(timeoutSeconds)
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
