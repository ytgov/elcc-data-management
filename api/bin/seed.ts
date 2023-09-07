import { seeder } from "@/db/umzug"

seeder.runAsCLI().then(() => process.exit(0))
