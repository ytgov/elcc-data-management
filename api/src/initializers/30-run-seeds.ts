import knex from "@/db/db-migration-client"
import { NODE_ENV } from "@/config"

async function runSeeds(): Promise<void> {
  if (NODE_ENV === "production") {
    console.info("Skipping seeds in production environment.")
    return
  }

  try {
    console.info("Running seeds...")
    await knex.seed.run()
    console.info("Seeds completed successfully.")
  } catch (error) {
    console.error(`Error running seeds: ${error}`, { error })
    throw error
  }
}

export default runSeeds
