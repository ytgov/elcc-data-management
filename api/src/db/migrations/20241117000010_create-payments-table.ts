import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("payments", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("centre_id").notNullable().references("id").inTable("centres")
    table.string("fiscal_year", 10).notNullable()
    table.date("paid_on").notNullable()
    table.integer("amount_in_cents").notNullable()
    table.string("name", 100).notNullable()
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))
    table.integer("fiscal_period_id").references("id").inTable("fiscal_periods")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("payments")
}
