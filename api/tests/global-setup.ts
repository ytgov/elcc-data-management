// Runs once before all tests

// sketchy hack to load paths, I'm pretty sure this isn't how its supposed to be used
import "tsconfig-paths/register"

import { migrator, seeder } from "@/db/umzug"

export default async function globalSetup() {
  await migrator.up().catch(console.error)
  await seeder.up().catch(console.error)
}
