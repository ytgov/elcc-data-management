import express, { Request, Response } from "express";
import { db } from "../data";
import { MigrationManager } from "../data/migration-manager";
import { RequireRole } from "../middleware";

export const migrationRouter = express.Router();
//migrationRouter.use(RequireRole("System Admin"));

const migrator = new MigrationManager(db);

migrationRouter.get("/", async (req: Request, res: Response) => {
  return res.json({ data: await migrator.listMigrations() });
});

migrationRouter.get("/up", async (req: Request, res: Response) => {
  await migrator.migrateUp();
  return res.json({ data: await migrator.listMigrations() });
});

migrationRouter.get("/down", async (req: Request, res: Response) => {
  await migrator.migrateDown();
  return res.json({ data: await migrator.listMigrations() });
});

migrationRouter.get("/seed", async (req: Request, res: Response) => {
  await migrator.seedUp();
  return res.json({ data: "Seeding" });
});
