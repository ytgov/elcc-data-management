import { QueryInterface } from "sequelize"
import { MigrationParams } from "umzug"

export function sequelizeAutoTransactionResolver({
  name,
  path,
  context,
}: MigrationParams<QueryInterface>) {
  if (path === undefined) throw new Error("Path is undefined")

  return {
    name,
    up: async () => {
      const migration = await import(path)
      return context.sequelize.transaction(() => {
        return migration.up({ context })
      })
    },
    down: async () => {
      const migration = await import(path)
      return context.sequelize.transaction(() => {
        return migration.down({ context })
      })
    },
  }
}
