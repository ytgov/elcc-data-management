import type * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  return knex.schema.createTable("user_roles", function (table) {
    table.string("email", 200).notNullable().references("users.email");
    table.string("role", 255).notNullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  return knex.schema.dropTable("user_roles");
};
