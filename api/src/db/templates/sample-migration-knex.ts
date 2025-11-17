import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  throw new Error("Not implemented")
  await knex.schema.createTable("table_name", function (table) {
    table.increments("id").notNullable().primary()
    table.string("name", 100).notNullable()
    table.string("status", 50).notNullable()

    // Timestamps using MSSQL DATETIME2 with UTC defaults
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    // Example unique constraint excluding soft-deleted records
    table.unique(["name"], {
      indexName: "table_name_name_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  throw new Error("Not implemented")
  await knex.schema.dropTable("table_name")
}
