import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("funding_submission_lines", function (table) {
    table.increments("id").notNullable().primary()
    table.string("fiscal_year", 10).notNullable()
    table.string("section_name", 200).notNullable()
    table.string("line_name", 200).notNullable()
    table.integer("from_age")
    table.integer("to_age")
    table.float("monthly_amount").notNullable()
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
  await knex.schema.dropTable("funding_submission_lines")
}
