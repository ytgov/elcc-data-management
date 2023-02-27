//month
import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  return knex.schema.createTable("centre_submissions", function (table) {
    table.increments("id").notNullable().primary();
    table.integer("centre_id").notNullable().references("centres.id");
    table.integer("month").notNullable();
    table.integer("payment").notNullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  return knex.schema.dropTable("centre_submissions");
};
