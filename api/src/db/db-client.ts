import { Sequelize } from "sequelize"

import { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } from "@/config"

if (DB_NAME === undefined) throw new Error("database name is unset.")
if (DB_USER === undefined) throw new Error("database username is unset.")
if (DB_PASS === undefined) throw new Error("database password is unset.")
if (DB_HOST === undefined) throw new Error("database host is unset.")
if (DB_PORT === undefined) throw new Error("database port is unset.")

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  dialect: "mssql",
  host: DB_HOST,
  port: DB_PORT,
  schema: "dbo",
})

export default db
