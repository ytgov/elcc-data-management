import knex, { Knex } from "knex"

import { resolve } from "path"

import { DB_CONFIG } from "../src/config"

const MIGRATION_CONIG = {
  // This sets the location of the knex_migrations table, NOT the default schema for queries.
  schemaName: "dbo",
  directory: resolve(__dirname, "../src/data/migrations"),
}

async function migrateLatest(db: Knex) {
  try {
    await db.migrate.latest(MIGRATION_CONIG)
    console.log("Migrations completed!")
  } finally {
    await db.destroy()
  }
}

// TODO: investigate if we want this in production as well
// In the past, I've worked on projects that _do_ automatically run all migrations on boot.
if (process.env.NODE_ENV === "development") {
  console.log("Running migrations on initial boot.")
  const db = knex(DB_CONFIG)

  migrateLatest(db)
}
