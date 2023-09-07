import express, { type Request, type Response } from "express"
import { db } from "@/data"
import { MigrationManager } from "@/data/migration-manager"

import { migrator } from "@/db/umzug"

export const migrationRouter = express.Router()
// migrationRouter.use(RequireRole("System Admin"));

const legacyMigrator = new MigrationManager(db)

async function listMigrations() {
  return Promise.all([migrator.executed(), migrator.pending()]).then(([executed, pending]) => {
    return {
      executed,
      pending,
    }
  })
}

migrationRouter.get("/", async (req: Request, res: Response) => {
  return res.json({ data: await listMigrations() })
})

migrationRouter.get("/up", async (req: Request, res: Response) => {
  await migrator.up()
  return res.json({ data: await listMigrations() })
})

migrationRouter.get("/down", async (req: Request, res: Response) => {
  await migrator.down()
  return res.json({ data: await listMigrations() })
})

migrationRouter.get("/seed", async (req: Request, res: Response) => {
  await legacyMigrator.seedUp()
  return res.json({ data: "Seeding" })
})
