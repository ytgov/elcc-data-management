import { seeder } from "@/db/umzug"

seeder
  .runAsCLI()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`Seeding Failed: ${error}`, { error })
    process.exit(1)
  })
