import { DataTypes } from "@sequelize/core"

import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("employee_benefits", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    centre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "centres", // use real table name here
        key: "id",
      },
    },
    fislcal_period_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "fiscal_periods", // use real table name here
        key: "id",
      },
    },
    gross_payroll_monthly_actual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    gross_payroll_monthly_estimated: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cost_cap_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    employee_cost_actual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    employee_cost_estimated: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    employer_cost_actual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    employer_cost_estimated: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    created_at: {
      type: MssqlSimpleTypes.DATETIME2(0),
      allowNull: false,
      defaultValue: MssqlSimpleTypes.NOW,
    },
    updated_at: {
      type: MssqlSimpleTypes.DATETIME2(0),
      allowNull: false,
      defaultValue: MssqlSimpleTypes.NOW,
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("employee_benefits")
}
