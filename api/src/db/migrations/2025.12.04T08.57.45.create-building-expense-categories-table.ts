import { DataTypes, sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.createTable("building_expense_categories", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    funding_region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "funding_regions",
        key: "id",
      },
    },
    category_name: {
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


  await queryInterface.addIndex(
    "building_expense_categories",
    ["funding_region_id", "category_name"],
    {
      name: "unique_building_expense_categories_on_funding_region_id_category_name",
      unique: true,
      where: {
        deleted_at: null,
      },
    }
  )
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("building_expense_categories")
}
