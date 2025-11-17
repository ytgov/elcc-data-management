import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("fiscal_periods", function (table) {
    table.increments("id").notNullable().primary()
    table.string("fiscal_year", 10).notNullable()
    table.string("month", 10).notNullable()
    table.specificType("date_start", "DATETIME2(0)").notNullable()
    table.specificType("date_end", "DATETIME2(0)").notNullable()
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))

    table.unique(["fiscal_year", "month"], {
      indexName: "fiscal_periods_fiscal_year_month",
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("fiscal_periods")
}
