import { MsSqlQueryInterface } from "@sequelize/mssql"
import { MigrationParams } from "umzug"

export function sequelizeAutoTransactionResolver({
  name,
  path,
  context,
}: MigrationParams<MsSqlQueryInterface>) {
  if (path === undefined) throw new Error("Path is undefined")

  return {
    name,
    up: async () => {
      const migration = await require(path)
      return context.sequelize
        .transaction(() => {
          return migration.up({ context })
        })
        .catch((error: unknown) => {
          console.info(
            `FUTURE DEV: If you see "The ROLLBACK TRANSACTION request has no corresponding BEGIN TRANSACTION." in the logs,
             there is probably a typo in a foreign key reference, a data type error, in your migration.
             This is a know bug when using MSSQL see: https://github.com/sequelize/sequelize/issues/8660 - PAST DEV
            `.replace(/\s+/g, " ")
          )

          throw error
        })
    },
    down: async () => {
      const migration = await require(path)
      return context.sequelize.transaction(() => {
        return migration.down({ context })
      })
    },
  }
}
