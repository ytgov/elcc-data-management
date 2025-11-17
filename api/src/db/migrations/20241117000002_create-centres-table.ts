import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("centres", function (table) {
    table.increments("id").notNullable().primary()
    table.string("name", 200).notNullable()
    table.string("license", 255)
    table.string("community", 255).notNullable()
    table.string("status", 255).notNullable()
    table.boolean("hot_meal")
    table.integer("licensed_for")
    table.date("last_submission")
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETDATE()"))
    table.string("license_holder_name", 100)
    table.string("contact_name", 100)
    table.string("physical_address", 250)
    table.string("mailing_address", 250)
    table.string("email", 100)
    table.string("alt_email", 100)
    table.string("phone_number", 20)
    table.string("alt_phone_number", 20)
    table.string("fax_number", 20)
    table.string("vendor_identifier", 20)
    table.boolean("is_first_nation_program").notNullable().defaultTo(false)
    table.string("inspector_name", 100)
    table.string("neighborhood", 100)
    table.string("region", 100).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("centres")
}
