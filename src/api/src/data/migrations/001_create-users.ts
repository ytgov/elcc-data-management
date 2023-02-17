import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  return knex.schema.createTable("users", function (table) {
    table.string("email", 200).primary();
    table.string("sub", 200).unique().notNullable();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("status", 50).notNullable();
    table.boolean("is_admin").notNullable().defaultTo(false);
    table.string("ynet_id", 50).nullable();
    table.string("directory_id", 50).nullable();
    table.specificType("create_date", "datetime2(0)").notNullable().defaultTo(knex.raw("GETDATE()"));
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  return knex.schema.dropTable("users");
};
