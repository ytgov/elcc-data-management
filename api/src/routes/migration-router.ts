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

migrationRouter.get("/", async (req: Request, res: Response) => {
  return listMigrations()
    .then((data) => res.json({ data }))
    .catch(console.error)
})

migrationRouter.get("/up", async (req: Request, res: Response) => {
  return migrator
    .up()
    .then(() => res.json({ data: listMigrations() }))
    .catch(console.error)
})

migrationRouter.get("/down", async (req: Request, res: Response) => {
  return migrator
    .down()
    .then(() => res.json({ data: listMigrations() }))
    .catch(console.error)
})

migrationRouter.get("/seed", async (req: Request, res: Response) => {
  return seeder
    .up()
    .then((data) => res.json({ data }))
    .catch(console.error)
})
