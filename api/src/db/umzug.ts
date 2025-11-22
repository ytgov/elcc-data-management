import { Umzug, SequelizeStorage, MigrationParams } from "umzug"
import { DataTypes, Model } from "@sequelize/core"
import { Attribute, NotNull, PrimaryKey, Table } from "@sequelize/core/decorators-legacy"
import { MsSqlQueryInterface } from "@sequelize/mssql"

import fs from "fs"
import path from "path"

import logger from "@/utils/logger"
import sequelize from "@/db/db-client"

import { UmzugNullStorage } from "@/db/umzug-null-storage"
import { sequelizeAutoTransactionResolver } from "@/db/utils/sequelize-auto-transaction-resolver"

// Create a custom SequelizeMeta model to avoid charset/collate options that are incompatible with MSSQL
@Table({
  tableName: "SequelizeMeta",
  timestamps: false,
  charset: undefined,
  collate: undefined,
})
class SequelizeMeta extends Model {
  @Attribute(DataTypes.STRING(255))
  @PrimaryKey
  @NotNull
  declare name: string
}

sequelize.addModels([SequelizeMeta])

export const migrator = new Umzug({
  migrations: {
    glob: ["migrations/*.{ts,js}", { cwd: __dirname }],
    resolve: sequelizeAutoTransactionResolver,
  },
  context: sequelize.queryInterface,
  storage: new SequelizeStorage({
    sequelize,
    model: SequelizeMeta,
    // FUTURE: 2023-10-28 enable this once api/src/db/migrations/2023.09.28T23.58.04.add-timestamp-columns-to-sequelize-meta-table.ts
    // has run in all environments.
    // timestamps: true,
  }),
  logger,
  create: {
    folder: path.join(__dirname, "migrations"),
    template: (filepath) => {
      const templatePath = path.join(__dirname, "templates/sample-migration.ts")
      const template = fs.readFileSync(templatePath).toString()
      return [[filepath, template]]
    },
  },
})

const environment = process.env.NODE_ENV || "development"
export const seeder = new Umzug({
  migrations: {
    glob: [`seeds/${environment}/*.{ts,js}`, { cwd: __dirname }],
  },
  storage: new UmzugNullStorage(),
  logger,
  create: {
    folder: path.join(__dirname, "seeds", environment),
    template: (filepath) => {
      const templatePath = path.join(__dirname, "templates/sample-seed.ts")
      const template = fs.readFileSync(templatePath).toString()
      return [[filepath, template]]
    },
  },
})

export type Migration = MigrationParams<MsSqlQueryInterface>
export type SeedMigration = MigrationParams<never>
