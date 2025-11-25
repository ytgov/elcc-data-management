import { migrator } from "@/db/umzug"

migrator
  .runAsCLI()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`Migration Failed: ${error}`, { error })
    process.exit(1)
  })
