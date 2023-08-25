import type * as knex from "knex"

exports.up = async function (knex: knex.Knex, Promise: any) {
  await knex.schema.createTable("funding_submission_line_json", (t) => {
    t.increments("id").primary()
    t.integer("centre_id").notNullable().references("centres.id")
    t.string("fiscal_year", 10).notNullable()
    t.string("date_name", 100).notNullable()
    t.specificType("date_start", "datetime2(0)").notNullable()
    t.specificType("date_end", "datetime2(0)").notNullable()
    t.specificType("values", "varchar(max)").notNullable()
  })
}

exports.down = async function (knex: knex.Knex, Promise: any) {
  await knex.schema.dropTable("funding_submission_line_json")
}
