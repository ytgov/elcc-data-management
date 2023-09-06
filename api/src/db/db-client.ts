import { Sequelize, Options } from "sequelize"

import { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } from "@/config"

if (DB_NAME === undefined) throw new Error("database name is unset.")
if (DB_USER === undefined) throw new Error("database username is unset.")
if (DB_PASS === undefined) throw new Error("database password is unset.")
if (DB_HOST === undefined) throw new Error("database host is unset.")
if (DB_PORT === undefined) throw new Error("database port is unset.")

export const SEQUELIZE_CONFIG: Options = {
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  dialect: "mssql",
  host: DB_HOST,
  port: DB_PORT,
  schema: "dbo",
}

const db = new Sequelize(SEQUELIZE_CONFIG)

export default db
