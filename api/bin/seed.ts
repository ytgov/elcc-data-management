import knex, { Knex } from "knex"

import { resolve } from "path"

import { DB_CONFIG } from "../src/config"

const MIGRATION_CONIG = {
  // This sets the location of the knex_migrations table, NOT the default schema for queries.
  schemaName: "dbo",
  directory: resolve(__dirname, "../src/data/seeds"),
}

async function seedAll(db: Knex) {
  try {
    await db.seed.run(MIGRATION_CONIG)
    console.log("Seeding completed!")
  } finally {
    await db.destroy()
  }
}

if (process.env.NODE_ENV === "development") {
  console.log("Running seeds on initial boot.")
  const db = knex(DB_CONFIG)

  seedAll(db)
}
