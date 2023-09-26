import { Umzug, SequelizeStorage } from "umzug"
import fs from "fs"
import path from "path"

import sequelize from "@/db/db-client"
import * as models from "@/models"

import { UmzugNullStorage } from "@/db/umzug-null-storage"

export const migrator = new Umzug({
  migrations: {
    glob: ["migrations/*.ts", { cwd: __dirname }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
  }),
  logger: console,
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
    glob: [`seeds/${environment}/*.ts`, { cwd: __dirname }],
  },
  context: models,
  storage: new UmzugNullStorage(),
  logger: console,
  create: {
    folder: path.join(__dirname, "seeds", environment),
    template: (filepath) => {
      const templatePath = path.join(__dirname, "templates/sample-seed.ts")
      const template = fs.readFileSync(templatePath).toString()
      return [[filepath, template]]
    },
  },
})

export type Migration = typeof migrator._types.migration
export type SeedMigration = typeof seeder._types.migration
