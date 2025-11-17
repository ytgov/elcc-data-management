import knex from "@/db/db-migration-client"

type MigrationInfo = {
  file: string
  directory: string
}

async function runMigrations(): Promise<void> {
  const [_completedMigrations, pendingMigrations]: [MigrationInfo[], MigrationInfo[]] =
    await knex.migrate.list()

  if (pendingMigrations.length === 0) {
    console.info("No pending migrations.")
    return
  }

  console.info(`Found ${pendingMigrations.length} pending migration(s).`)

  return pendingMigrations
    .reduce(async (previousMigration, { file, directory }) => {
      await previousMigration

      console.info(`Running migration: ${directory}/${file}`)
      return knex.migrate.up()
    }, Promise.resolve())
    .then(() => {
      console.info("All migrations completed successfully.")
    })
    .catch((error) => {
      console.error(`Error running migrations: ${error}`, { error })
      throw error
    })
}

export default runMigrations
