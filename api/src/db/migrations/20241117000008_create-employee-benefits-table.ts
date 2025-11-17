import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("employee_benefits", function (table) {
    table.increments("id").notNullable().primary()
    table.integer("centre_id").notNullable().references("id").inTable("centres")
    table
      .integer("fiscal_period_id")
      .notNullable()
      .references("id")
      .inTable("fiscal_periods")
    table.decimal("gross_payroll_monthly_actual", 10, 2).notNullable()
    table.decimal("gross_payroll_monthly_estimated", 10, 2).notNullable()
    table.decimal("cost_cap_percentage", 5, 2).notNullable()
    table.decimal("employee_cost_actual", 10, 2).notNullable()
    table.decimal("employee_cost_estimated", 10, 2).notNullable()
    table.decimal("employer_cost_actual", 10, 2).notNullable()
    table.decimal("employer_cost_estimated", 10, 2).notNullable()
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))

    table.unique(["centre_id", "fiscal_period_id"], {
      indexName: "employee_benefits_centre_id_fiscal_period_id",
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("employee_benefits")
}
