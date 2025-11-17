import type { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
  throw new Error("Not implemented")

  // Example: Insert seed data with upsert pattern
  // This uses ON CONFLICT for idempotent seeding
  await knex("table_name")
    .insert([
      {
        id: 1,
        name: "Example 1",
        status: "active",
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
      {
        id: 2,
        name: "Example 2",
        status: "active",
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
    ])
    .onConflict("id")
    .merge()

  // Alternative: Check if data exists before inserting
  const existingRecord = await knex("table_name").where({ id: 1 }).first()
  if (!existingRecord) {
    await knex("table_name").insert({
      id: 1,
      name: "Example",
      status: "active",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    })
  }
}
