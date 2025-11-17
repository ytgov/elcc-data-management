import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("funding_submission_line_jsons", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("centre_id").notNullable().references("id").inTable("centres")
    table.string("fiscal_year", 10).notNullable()
    table.string("date_name", 100).notNullable()
    table.specificType("date_start", "DATETIME2(0)").notNullable()
    table.specificType("date_end", "DATETIME2(0)").notNullable()
    table.specificType("values", "NVARCHAR(MAX)").notNullable()
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
  await knex.schema.dropTable("funding_submission_line_jsons")
}
