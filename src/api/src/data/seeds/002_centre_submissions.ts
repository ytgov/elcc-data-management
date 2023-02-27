import * as knex from "knex";

exports.seed = function (knex: knex.Knex, Promise: any) {
  return knex("centre_submissions")
    .truncate()
    .then(function () {
      //   return knex("centre_submissions").insert([]);
    });
};
