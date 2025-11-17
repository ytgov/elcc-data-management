import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("wage_enhancements", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("centre_id").notNullable().references("id").inTable("centres")
    table
      .integer("employee_wage_tier_id")
      .notNullable()
      .references("id")
      .inTable("employee_wage_tiers")
    table.string("employee_name", 100).notNullable()
    table.float("hours_estimated").notNullable()
    table.float("hours_actual").notNullable()
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
  await knex.schema.dropTable("wage_enhancements")
}
