import { Sequelize, Options } from "@sequelize/core"
import { MsSqlDialect } from "@sequelize/mssql"
import { isEmpty, isNil } from "lodash"

import {
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_USER,
  DB_TRUST_SERVER_CERTIFICATE,
  NODE_ENV,
} from "@/config"
import compactSql from "@/db/utils/compact-sql"

if (isEmpty(DB_NAME)) throw new Error("database name is unset.")
if (isEmpty(DB_USER)) throw new Error("database username is unset.")
if (isEmpty(DB_PASS)) throw new Error("database password is unset.")
if (isEmpty(DB_HOST)) throw new Error("database host is unset.")
if (isNil(DB_PORT)) throw new Error("database port is unset.")

function sqlLogger(query: string) {
  console.log(compactSql(query))
}

// See https://sequelize.org/docs/v7/databases/mssql/
export const SEQUELIZE_CONFIG: Options<MsSqlDialect> = {
  dialect: MsSqlDialect,
  server: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  encrypt: true,
  authentication: {
    type: "default",
    options: {
      userName: DB_USER,
      password: DB_PASS,
    },
  },
  schema: "dbo", // default - explicit for clarity
  // Avoids need to have a signed certificate in development.
  trustServerCertificate: DB_TRUST_SERVER_CERTIFICATE,
  logging: NODE_ENV === "development" ? sqlLogger : false,
  define: {
    underscored: true,
    timestamps: true, // default - explicit for clarity.
    paranoid: true, // adds deleted_at column
  },
}

const db = new Sequelize(SEQUELIZE_CONFIG)

export default db
