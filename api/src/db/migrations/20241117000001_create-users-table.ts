import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", function (table) {
    table.increments("id").notNullable().primary()
    table.string("email", 200).notNullable()
    table.string("sub", 200).notNullable()
    table.string("first_name", 100).notNullable()
    table.string("last_name", 100).notNullable()
    table.string("status", 50).notNullable()
    table.boolean("is_admin").notNullable().defaultTo(false)
    table.string("ynet_id", 50)
    table.string("directory_id", 50)
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))

    table.unique(["email"], { indexName: "users_email_uk" })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users")
}
