import { migrator } from "@/db/umzug"

export async function runMigrations(): Promise<void> {
  await migrator.up()
  console.info("All migrations completed successfully.")
  return
}

export default runMigrations
