import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.query(`raise fail('up migration not implemented')`)
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.query(`raise fail('down migration not implemented')`)
}
