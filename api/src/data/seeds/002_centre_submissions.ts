import type * as knex from "knex"

exports.seed = async function (knex: knex.Knex, Promise: any) {
  const hasCenterSubmissionsTable = await knex.schema.hasTable('centre_submissions')

  if (!hasCenterSubmissionsTable) return

  await knex("centre_submissions")
    .truncate()
    .then(function () {
      //   return knex("centre_submissions").insert([]);
    })
}
