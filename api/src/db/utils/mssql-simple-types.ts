import { Sequelize, sql } from "@sequelize/core"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sequelizeVersion = (Sequelize as any).version
const major = sequelizeVersion.split(".").map(Number)[0]

if (major >= 7) {
  console.warn("This shim was made redundant in Sequelize v7, prefer manual type definition")
}

/** @deprecated - prefer manual type definition, e.g. `datetime2` */
function DATETIME2(length?: number): string {
  if (length === undefined) {
    return `datetime2`
  } else {
    return `datetime2(${length})`
  }
}

/**
 * @deprecated - prefer manual type definition
 *
 * @example
 * ```ts
 * created_at: {
 *   type: "datetime2",
 *   allowNull: false,
 *   defaultValue: sql.fn("getutcdate"),
 * },
 * updated_at: {
 *   type: "datetime2",
 *   allowNull: false,
 *   defaultValue: sql.fn("getutcdate"),
 * },
 * ```
 */
export const MssqlSimpleTypes = {
  /** @deprecated - prefer manual type definition, e.g. sql.fn("getutcdate") */
  NOW: sql.fn("GETDATE"),
  DATETIME2,
}
