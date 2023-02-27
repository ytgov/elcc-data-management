import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  return knex.schema.createTable("logs", function (table) {
    table.increments("id").notNullable().primary();
    table.string("table_name", 200).notNullable();
    table.string("operation", 200).notNullable();
    table.string("user_email", 200).notNullable();
    table.specificType("date", "datetime2(0)").notNullable().defaultTo(knex.raw("GETDATE()"));
  });
};
