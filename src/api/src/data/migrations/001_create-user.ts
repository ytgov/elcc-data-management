import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  return knex.schema.dropTable("users");
};
