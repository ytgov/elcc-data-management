import * as knex from "knex";

exports.seed = async function (knex: knex.Knex, Promise: any) {
  await knex("centres").delete().whereRaw("1=1");

  return knex("centres").insert([
    {
      name: "Grow with Joy 2nd",
      license: "123",
      community: "Whitehorse",
      status: "Up to date",
      hot_meal: true,
      licensed_for: 19,
      last_submission: "2019-01-01"
    },
    {
      name: "Happy Hearts Preschool",
      license: "456",
      community: "Whitehorse",
      status: "Up to date",
      hot_meal: true,
      licensed_for: 25,
      last_submission: "2019-01-01"
    }
  ]);
};
