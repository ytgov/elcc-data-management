import type * as knex from "knex";

exports.seed = async function (knex: knex.Knex, Promise: any) {
  await knex("centre_submissions")
    .truncate()
    .then(function () {
      //   return knex("centre_submissions").insert([]);
    });
};
