import { migrator } from "@/db/umzug"

export async function runMigrations(): Promise<void> {
  await migrator.up()
  return
}

export default runMigrations
