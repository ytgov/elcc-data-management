import { migrator } from "@/db/umzug"

migrator.runAsCLI().then(() => process.exit(0))
