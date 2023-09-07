import { Umzug, SequelizeStorage } from "umzug"
import fs from "fs"
import path from "path"

import sequelize from "@/db/db-client"

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
      const templatePath = path.join(__dirname, "template/sample-migration.ts")
      const template = fs.readFileSync(templatePath).toString()
      return [[filepath, template]]
    },
  },
})

export type Migration = typeof migrator._types.migration
