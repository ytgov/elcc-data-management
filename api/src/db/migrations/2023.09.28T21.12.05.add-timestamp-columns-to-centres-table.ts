import { type Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export async function up({ context: queryInterface }: Migration) {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.addColumn(
      "centres",
      "created_at",
      {
        type: MssqlSimpleTypes.DATETIME2(),
        allowNull: false,
        defaultValue: MssqlSimpleTypes.NOW,
      },
      { transaction }
    )
    await queryInterface.addColumn(
      "centres",
      "updated_at",
      {
        type: MssqlSimpleTypes.DATETIME2(),
        allowNull: false,
        defaultValue: MssqlSimpleTypes.NOW,
      },
      { transaction }
    )

    await queryInterface.sequelize.query(
      `
    UPDATE
      centres
    SET
      created_at = create_date
    FROM
      centres
    `,
      { transaction }
    )
    await queryInterface.removeColumn("centres", "create_date", { transaction })
  })
}

export async function down({ context: queryInterface }: Migration) {
  return queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.addColumn(
      "centres",
      "create_date",
      {
        type: MssqlSimpleTypes.DATETIME2(0),
        allowNull: false,
        defaultValue: MssqlSimpleTypes.NOW,
      },
      { transaction }
    )
    await queryInterface.sequelize.query(
      `
    UPDATE
      centres
    SET
      create_date = created_at
    FROM
      centres
    `,
      { transaction }
    )

    await queryInterface.removeColumn("centres", "created_at", { transaction })
    await queryInterface.removeColumn("centres", "updated_at", { transaction })
  })
}
