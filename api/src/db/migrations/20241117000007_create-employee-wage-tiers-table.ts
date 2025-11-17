import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("employee_wage_tiers", function (table) {
    table.increments("id").notNullable().primary()
    table
      .integer("fiscal_period_id")
      .notNullable()
      .references("id")
      .inTable("fiscal_periods")
    table.integer("tier_level").notNullable()
    table.string("tier_label", 50).notNullable()
    table.float("wage_rate_per_hour").notNullable()
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))

    table.unique(["fiscal_period_id", "tier_level"], {
      indexName: "unique_employee_wage_tiers_on_fiscal_period_id_tier_level",
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("employee_wage_tiers")
}
