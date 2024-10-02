import { seeder } from "@/db/umzug"
import { Centre } from "@/models"

export async function runSeeds(): Promise<void> {
  if (process.env.SKIP_SEEDING_UNLESS_EMPTY === "true") {
    const count = await Centre.count({ logging: false })

    if (count > 0) {
      console.warn("Skipping seeding as SKIP_SEEDING_UNLESS_EMPTY set, and data already seeded.")
      return
    }
  }

  try {
    await seeder.up()
  } catch (error) {
    console.error(`Error running seeds: ${error}`, { error })
    throw error
  }

  return
}

export default runSeeds
