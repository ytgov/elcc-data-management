import { type Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("logs", "created_at", {
    type: MssqlSimpleTypes.DATETIME2(),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })
  await queryInterface.addColumn("logs", "updated_at", {
    type: MssqlSimpleTypes.DATETIME2(),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })

  await queryInterface.sequelize.query(
    `
    UPDATE
      logs
    SET
      created_at = date
    FROM
      logs
    `
  )
  await queryInterface.removeColumn("logs", "date")
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("logs", "date", {
    type: MssqlSimpleTypes.DATETIME2(0),
    allowNull: false,
    defaultValue: MssqlSimpleTypes.NOW,
  })
  await queryInterface.sequelize.query(
    `
    UPDATE
      logs
    SET
      date = created_at
    FROM
      logs
    `
  )

  await queryInterface.removeColumn("logs", "created_at")
  await queryInterface.removeColumn("logs", "updated_at")
}
