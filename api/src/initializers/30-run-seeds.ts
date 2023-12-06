import { seeder } from "@/db/umzug"

export async function runSeeds(): Promise<void> {
  await seeder.up()
  return
}

export default runSeeds
