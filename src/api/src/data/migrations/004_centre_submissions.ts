import type * as knex from "knex";

exports.up = async function (knex: knex.Knex, Promise: any) {
  await knex.schema.createTable("funding_period", (t) => {
    t.increments("id").notNullable().primary();
    t.string("fiscal_year", 10).notNullable();
    t.specificType("from_date", "datetime2(0)").notNullable();
    t.specificType("to_date", "datetime2(0)").notNullable();
    t.string("title", 100).notNullable();
    t.boolean("is_fiscal_year").notNullable().defaultTo(false);
    t.boolean("is_school_month").notNullable().defaultTo(true);
  });

  await knex.schema.createTable("centre_funding_period", (t) => {
    t.increments("id").notNullable().primary();
    t.integer("centre_id").notNullable().references("centres.id");
    t.integer("fiscal_period_id").notNullable().references("funding_period.id");
    t.text("notes").nullable();
  });

  await knex.schema.createTable("funding_submission_line", (t) => {
    t.increments("id").notNullable().primary();
    t.string("fiscal_year", 10).notNullable();
    t.string("section_name", 200).notNullable();
    t.string("line_name", 200).notNullable();
    t.integer("from_age").nullable();
    t.integer("to_age").nullable();
    t.float("monthly_amount").notNullable();
  });

  await knex.schema.createTable("funding_submission_line_value", (t) => {
    t.increments("id").notNullable().primary();
    t.integer("centre_id").notNullable().references("centres.id");
    t.integer("submission_line_id").notNullable().references("funding_submission_line.id");
    t.string("fiscal_year", 10).notNullable();
    t.string("section_name", 200).notNullable();
    t.string("line_name", 200).notNullable();
    t.float("monthly_amount").notNullable();
    t.string("date_name", 100).notNullable();
    t.specificType("date_start", "datetime2(0)").notNullable();
    t.specificType("date_end", "datetime2(0)").notNullable();
    t.float("child_count").notNullable();
    t.float("computed_total").notNullable();
    t.boolean("is_actual").notNullable().defaultTo(true);
  });
};

exports.down = async function (knex: knex.Knex, Promise: any) {
  await knex.schema.dropTable("funding_submission_line_value");
  await knex.schema.dropTable("funding_submission_line");
  await knex.schema.dropTable("centre_funding_period");
  await knex.schema.dropTable("funding_period");
};
