import { DataTypes, sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.createTable("funding_reconciliation_adjustments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    funding_reconciliation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "funding_reconciliations",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    fiscal_period_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "fiscal_periods",
        key: "id",
      },
    },
    funding_received_period_amount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
    },
    eligible_expenses_period_amount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
    },
    payroll_adjustments_period_amount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
    },
    cumulative_balance_amount: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
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
    "funding_reconciliation_adjustments",
    ["funding_reconciliation_id", "fiscal_period_id"],
    {
      name: "unique_funding_reconciliation_adjustments_on_funding_reconciliation_id_fiscal_period_id",
      unique: true,
      where: {
        deleted_at: null,
      },
    }
  )
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("funding_reconciliation_adjustments")
}
