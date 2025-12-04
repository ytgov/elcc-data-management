import { DataTypes, sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.createTable("building_expenses", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    building_expense_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "building_expense_categories",
        key: "id",
      },
    },
    centre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "centres",
        key: "id",
      },
    },
    fiscal_period_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "fiscal_periods",
        key: "id",
      },
    },
    subsidy_rate: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
    },
    building_usage_percent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    estimated_cost: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
    },
    actual_cost: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
    },
    total_cost: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    "building_expenses",
    ["centre_id", "fiscal_period_id", "building_expense_category_id"],
    {
      name: "unique_building_expenses_on_centre_id_fiscal_period_id_category_id",
      unique: true,
      where: {
        deleted_at: null,
      },
    }
  )
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("building_expenses")
}
