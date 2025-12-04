import { DataTypes, sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.createTable("funding_regions", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subsidy_rate: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
    },
    created_at: {
      type: "datetime2",
      allowNull: false,
      defaultValue: sql.fn("getutcdate"),
    },
    updated_at: {
      type: "datetime2",
      allowNull: false,
      defaultValue: sql.fn("getutcdate"),
    },
    deleted_at: {
      type: "datetime2",
      allowNull: true,
    },
  })

  // Add unique constraint on region (where not soft deleted)
  await queryInterface.addIndex("funding_regions", ["region"], {
    name: "unique_funding_regions_on_region",
    unique: true,
    where: {
      deleted_at: null,
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("funding_regions")
}
