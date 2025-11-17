import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("funding_periods", function (table) {
    table.increments("id").notNullable().primary()
    table.string("fiscal_year", 10).notNullable()
    table.specificType("from_date", "DATETIME2(0)").notNullable()
    table.specificType("to_date", "DATETIME2(0)").notNullable()
    table.string("title", 100).notNullable()
    table.boolean("is_fiscal_year").notNullable().defaultTo(false)
    table.boolean("is_school_month").notNullable().defaultTo(true)
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
  await knex.schema.dropTable("funding_periods")
}
