import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  return knex.schema.createTable("centres", function (table) {
    table.increments("id").notNullable().primary();
    table.string("name", 200).notNullable();
    table.string("license", 255).notNullable();
    table.string("community", 255).notNullable();
    table.string("status", 255).notNullable();
    table.boolean("hot_meal").notNullable();
    table.integer("licensed_for", 255).notNullable(); //number of childre
    table.date("last_submission").notNullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  return knex.schema.dropTable("centres");
};
