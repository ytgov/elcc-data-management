import knex from "@/db/db-migration-client"
import { NODE_ENV } from "@/config"

async function runKnexSeeds(): Promise<void> {
  if (NODE_ENV === "production") {
    console.info("Skipping Knex seeds in production environment.")
    return
  }

  try {
    console.info("Running Knex seeds...")
    await knex.seed.run()
    console.info("Knex seeds completed successfully.")
  } catch (error) {
    console.error(`Error running Knex seeds: ${error}`, { error })
    throw error
  }
}

export default runKnexSeeds
