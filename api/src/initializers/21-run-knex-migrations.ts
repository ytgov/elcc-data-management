import knex from "@/db/db-migration-client"

type MigrationInfo = {
  file: string
  directory: string
}

async function runKnexMigrations(): Promise<void> {
  const [_completedMigrations, pendingMigrations]: [MigrationInfo[], MigrationInfo[]] =
    await knex.migrate.list()

  if (pendingMigrations.length === 0) {
    console.info("No pending Knex migrations.")
    return
  }

  console.info(`Found ${pendingMigrations.length} pending Knex migration(s).`)

  return pendingMigrations
    .reduce(async (previousMigration, { file, directory }) => {
      await previousMigration

      console.info(`Running Knex migration: ${directory}/${file}`)
      return knex.migrate.up()
    }, Promise.resolve())
    .then(() => {
      console.info("All Knex migrations completed successfully.")
    })
    .catch((error) => {
      console.error(`Error running Knex migrations: ${error}`, { error })
      throw error
    })
}

export default runKnexMigrations
