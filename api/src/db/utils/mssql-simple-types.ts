import { Sequelize, sql } from "@sequelize/core"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sequelizeVersion = (Sequelize as any).version
const major = sequelizeVersion.split(".").map(Number)[0]

if (major >= 7) {
  console.warn("This shim was probably made redundant in Sequelize v7, you should check!")
}

function DATETIME2(length?: number): string {
  if (length === undefined) {
    return `datetime2`
  } else {
    return `datetime2(${length})`
  }
}

export const MssqlSimpleTypes = {
  NOW: sql.fn("GETDATE"),
  DATETIME2,
}
