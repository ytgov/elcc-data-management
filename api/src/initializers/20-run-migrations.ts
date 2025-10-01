import { migrator } from "@/db/umzug"

export async function runMigrations(): Promise<void> {
  migrator.on("migrating", (event) => {
    console.info(`Running migration: ${event.name}`)
  })

  migrator.on("migrated", (event) => {
    console.info(`Completed migration: ${event.name}`)
  })

  try {
    const executedMigrations = await migrator.up()

    if (executedMigrations.length === 0) {
      console.info("No new migrations to run. Database is up to date.")
    } else {
      console.info("All migrations completed successfully.")
    }
  } catch (error) {
    console.error(`Migration failed: ${error}`, { error })

    const pendingMigrations = await migrator.pending()

    if (pendingMigrations.length > 0) {
      console.error(`Failed migration file: ${pendingMigrations[0].name}`)
    }

    throw error
  }

  return
}

export default runMigrations
