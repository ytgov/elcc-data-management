import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_roles", function (table) {
    table.increments("id").notNullable().primary()
    table.string("role", 255).notNullable()
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
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
  await knex.schema.dropTable("user_roles")
}
