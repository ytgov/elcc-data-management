import express, { type Request, type Response } from "express"

import { migrator, seeder } from "@/db/umzug"

export const migrationRouter = express.Router()
// migrationRouter.use(RequireRole("System Admin"));

async function listMigrations() {
  return Promise.all([migrator.executed(), migrator.pending()])
    .then(([executed, pending]) => {
      return {
        executed,
        pending,
      }
    })
    .catch(console.error)
}

migrationRouter.get("/", async (_req: Request, res: Response) => {
  return listMigrations()
    .then((data) => res.json({ data }))
    .catch(console.error)
})

migrationRouter.get("/up", async (_req: Request, res: Response) => {
  return migrator
    .up()
    .then(async () => res.json({ data: await listMigrations() }))
    .catch(console.error)
})

migrationRouter.get("/down", async (_req: Request, res: Response) => {
  return migrator
    .down()
    .then(async () => res.json({ data: await listMigrations() }))
    .catch(console.error)
})

migrationRouter.get("/seed", async (_req: Request, res: Response) => {
  return seeder
    .up()
    .then((data) => res.json({ data }))
    .catch(console.error)
})
