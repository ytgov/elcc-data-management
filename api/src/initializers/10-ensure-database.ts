import { QueryTypes, Sequelize } from "@sequelize/core"
import { merge } from "lodash"

import { DB_NAME } from "@/config"
import { SEQUELIZE_CONFIG } from "@/db/db-client"
import { isCredentialFailure } from "@/utils/db-error-helpers"

async function databaseExists(db: Sequelize, databaseName: string): Promise<boolean> {
  const result = await db.query("SELECT 1 FROM sys.databases WHERE name = ?", {
    type: QueryTypes.SELECT,
    replacements: [databaseName],
  })

  return result.length > 0
}

async function ensureDatabase(): Promise<true> {
  console.info("Attempting direct to database connection to determine if database exists...")
  const databaseConfig = SEQUELIZE_CONFIG
  let dbMigrationClient = new Sequelize(databaseConfig)
  let isCredentialFailureError = false

  try {
    if (await databaseExists(dbMigrationClient, DB_NAME)) {
      return true
    }
  } catch (error) {
    if (isCredentialFailure(error)) {
      isCredentialFailureError = true
      console.info("Database connection failed due to invalid credential, retrying...")
    } else {
      console.error(
        `Unknown connection failure, could not determine if database exists: ${error}`,
        {
          error,
        }
      )
      throw error
    }
  }

  if (isCredentialFailureError) {
    console.info("Attempting server-level connection to determine if database exists...")
    const serverLevelConfig = merge(SEQUELIZE_CONFIG, { database: "" })
    dbMigrationClient = new Sequelize(serverLevelConfig)
    try {
      if (await databaseExists(dbMigrationClient, DB_NAME)) {
        return true
      }
    } catch (error) {
      console.error(
        `Could not determine if database exists database with server-level connection: ${error}`,
        { error }
      )
      throw error
    }
  }

  console.info(`Database ${DB_NAME} does not exist: creating...`)
  try {
    await dbMigrationClient.query(`CREATE DATABASE ${DB_NAME}`, { raw: true })
  } catch (error) {
    console.error(`Failed to create database: ${error}`, { error })
    throw error
  }

  return true
}

export default ensureDatabase
