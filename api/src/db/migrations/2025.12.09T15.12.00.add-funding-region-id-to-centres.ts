import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("centres", "funding_region_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      table: "funding_regions",
      key: "id",
    },
  })

  await queryInterface.sequelize.query(/* sql */ `
    UPDATE centres
    SET
      funding_region_id = COALESCE(
        (
          SELECT
            funding_regions.id
          FROM
            funding_regions
          WHERE
            LOWER(centres.region) = LOWER(funding_regions.region)
            AND funding_regions.deleted_at IS NULL
        ),
        (
          SELECT
            funding_regions.id
          FROM
            funding_regions
          WHERE
            LOWER(funding_regions.region) = 'whitehorse'
            AND funding_regions.deleted_at IS NULL
        )
      )
  `)

  await queryInterface.changeColumn("centres", "funding_region_id", {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      table: "funding_regions",
      key: "id",
    },
  })

  await queryInterface.removeColumn("centres", "region")
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("centres", "region", {
    type: DataTypes.STRING(100),
    allowNull: true,
  })

  await queryInterface.sequelize.query(/* sql */ `
    UPDATE centres
    SET
      region = funding_regions.region
    FROM
      funding_regions
    WHERE
      centres.funding_region_id = funding_regions.id
      AND funding_regions.deleted_at IS NULL
  `)

  await queryInterface.changeColumn("centres", "region", {
    type: DataTypes.STRING(100),
    allowNull: false,
  })

  await queryInterface.removeColumn("centres", "funding_region_id")
}
