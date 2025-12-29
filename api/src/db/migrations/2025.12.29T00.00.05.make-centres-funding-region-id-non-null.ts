import { DataTypes, QueryTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"
import { removeConstraint } from "@/db/utils/mssql-remove-constraint"

export async function up({ context: queryInterface }: Migration) {
  const centresWithoutFundingRegion = await queryInterface.sequelize.query<{
    count: string
  }>(
    /* sql */ `
      SELECT
        COUNT(*) as count
      FROM
        centres
      WHERE
        funding_region_id IS NULL
    `,
    { type: QueryTypes.SELECT }
  )

  const unlinkedCentreCount = parseInt(centresWithoutFundingRegion[0].count)
  if (unlinkedCentreCount > 0) {
    throw new Error(
      `Cannot make funding_region_id non-null: ${unlinkedCentreCount} centres have null funding_region_id. ` +
        `Please assign a funding region to all centres before running this migration.`
    )
  }

  await removeConstraint(queryInterface, "centres", {
    type: "FOREIGN KEY",
    fields: ["funding_region_id"],
    multiple: true,
  })

  await queryInterface.sequelize.query(/* sql */ `
    ALTER TABLE centres
    ALTER COLUMN funding_region_id INT NOT NULL
  `)

  await queryInterface.addConstraint("centres", {
    fields: ["funding_region_id"],
    type: "FOREIGN KEY",
    references: {
      table: "funding_regions",
      field: "id",
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  await removeConstraint(queryInterface, "centres", {
    type: "FOREIGN KEY",
    fields: ["funding_region_id"],
  })

  // Restore the two duplicate FK constraints that existed before this migration
  // Using changeColumn twice creates two separate FK constraints
  await queryInterface.changeColumn("centres", "funding_region_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      table: "funding_regions",
      key: "id",
    },
  })
  // NOTE: changeColumn allowNull: false doesn't seem to work with MSSQL and foreign keys
  await queryInterface.changeColumn("centres", "funding_region_id", {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      table: "funding_regions",
      key: "id",
    },
  })
}
