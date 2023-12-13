import { DB_NAME, DB_HOST, DB_PASS, DB_PORT, NODE_ENV } from "@/config"
import { QueryTypes, Sequelize } from "sequelize"

async function databaseExists(db: Sequelize, databaseName: string): Promise<boolean> {
  const result = await db.query("SELECT 1 FROM sys.databases WHERE name = ?", {
    type: QueryTypes.SELECT,
    replacements: [databaseName],
  })

  return result.length > 0
}

async function createDatabase(): Promise<void> {
  if (
    NODE_ENV === "production" &&
    process.env.PRODUCTION_DATABASE_SA_MASTER_CREDS_AVAILABLE !== "true"
  ) {
    console.info(
      "Skipping database creation initializer because production database sa:master credentials are not available."
    )
    return
  }

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

  if (await databaseExists(db, DB_NAME)) return

  console.log(`Database ${DB_NAME} does not exist: creating...`)
  await db.query(`CREATE DATABASE ${DB_NAME}`, { raw: true }).catch((error) => {
    console.error("Failed to create database:", error)
  })
  return
}

export default createDatabase
