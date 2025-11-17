import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("logs", function (table) {
    table.increments("id").notNullable().primary()
    table.string("table_name", 200).notNullable()
    table.string("operation", 200).notNullable()
    table.string("user_email", 200).notNullable()
    table.string("data", 2000).notNullable()
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("logs")
}
