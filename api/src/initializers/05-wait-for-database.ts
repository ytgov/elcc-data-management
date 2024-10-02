import { Sequelize } from "sequelize"
import { merge } from "lodash"

import {
  DB_HEALTH_CHECK_INTERVAL_SECONDS,
  DB_HEALTH_CHECK_RETRIES,
  DB_HEALTH_CHECK_START_PERIOD_SECONDS,
  DB_HEALTH_CHECK_TIMEOUT_SECONDS,
} from "@/config"
import { SEQUELIZE_CONFIG } from "@/db/db-client"
import sleep from "@/utils/sleep"
import { isCredentialFailure, isNetworkFailure, isSocketFailure } from "@/utils/db-error-helpers"

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

export async function waitForDatabase({
  intervalSeconds = DB_HEALTH_CHECK_INTERVAL_SECONDS,
  timeoutSeconds = DB_HEALTH_CHECK_TIMEOUT_SECONDS,
  retries = DB_HEALTH_CHECK_RETRIES,
  startPeriodSeconds = DB_HEALTH_CHECK_START_PERIOD_SECONDS,
}: {
  intervalSeconds?: number
  timeoutSeconds?: number
  retries?: number
  startPeriodSeconds?: number
} = {}): Promise<void> {
  await sleep(startPeriodSeconds)

  console.info("Attempting direct to database connection...")
  const databaseConfig = SEQUELIZE_CONFIG
  let dbMigrationClient = new Sequelize(databaseConfig)
  let isDatabaseSocketReady = false

  await sleep(startPeriodSeconds)

  for (let i = 0; i < retries; i++) {
    try {
      await checkHealth(dbMigrationClient, timeoutSeconds)
      console.info("Database connection successful.")
      return
    } catch (error) {
      if (isSocketFailure(error)) {
        console.info(`Database socket is not ready, retrying... ${error}`, { error })
        await sleep(intervalSeconds)
      } else if (isNetworkFailure(error)) {
        console.info(`Network error, retrying... ${error}`, { error })
        await sleep(intervalSeconds)
      } else if (isCredentialFailure(error)) {
        if (isDatabaseSocketReady) {
          console.error(`Database connection failed due to invalid credentials: ${error}`, {
            error,
          })
          throw error
        } else {
          console.info(
            "Falling back to database server-level connection (database might not exist)..."
          )
          const serverLevelConfig = merge(SEQUELIZE_CONFIG, { database: "" })
          dbMigrationClient = new Sequelize(serverLevelConfig)
          i -= 1
          isDatabaseSocketReady = true
          continue
        }
      } else {
        console.error(`Unknown database connection error: ${error}`, { error })
        throw error
      }
    }
  }

  throw new Error(`Failed to connect to the database due to timeout.`)
}

export default waitForDatabase
