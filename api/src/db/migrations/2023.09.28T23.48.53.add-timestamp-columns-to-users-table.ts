import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("users", "created_at", {
    type: MssqlSimpleTypes.DATETIME2(),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })
  await queryInterface.addColumn("users", "updated_at", {
    type: MssqlSimpleTypes.DATETIME2(),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })

  await queryInterface.sequelize.query(
    `
    UPDATE
      users
    SET
      created_at = create_date
    FROM
      users
    `
  )
  await queryInterface.removeColumn("users", "create_date")
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("users", "create_date", {
    type: MssqlSimpleTypes.DATETIME2(0),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })
  await queryInterface.sequelize.query(
    `
    UPDATE
      users
    SET
      create_date = created_at
    FROM
      users
    `
  )

  await queryInterface.removeColumn("users", "created_at")
  await queryInterface.removeColumn("users", "updated_at")
}
