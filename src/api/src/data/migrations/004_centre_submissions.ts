//month
import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  return knex.schema.createTable("centre_submissions", function (table) {
    table.increments("id").notNullable().primary();
    table.integer("centre_id").notNullable().references("centres.id");
    table.string("month", 100).notNullable();
    table.specificType("start_date", "datetime2(0)").notNullable();
    table.specificType("end_date", "datetime2(0)").notNullable();
    table.float("payment").notNullable();
    table.string("submitted_by", 200).notNullable();
    table.specificType("submitted_date", "datetime2(0)").notNullable().defaultTo(knex.raw("GETDATE()"));
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  return knex.schema.dropTable("centre_submissions");
};
