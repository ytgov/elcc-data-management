import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("centres", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
  await queryInterface.addColumn("employee_benefits", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
  await queryInterface.addColumn("employee_wage_tiers", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
  await queryInterface.addColumn("fiscal_periods", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
  await queryInterface.addColumn("funding_periods", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
  await queryInterface.addColumn("funding_submission_line_jsons", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
  await queryInterface.addColumn("funding_submission_lines", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
  await queryInterface.addColumn("logs", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
  await queryInterface.addColumn("payments", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
  await queryInterface.addColumn("users", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
  await queryInterface.addColumn("wage_enhancements", "deleted_at", {
    type: DataTypes.DATE,
    allowNull: true,
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeColumn("centres", "deleted_at")
  await queryInterface.removeColumn("employee_benefits", "deleted_at")
  await queryInterface.removeColumn("employee_wage_tiers", "deleted_at")
  await queryInterface.removeColumn("fiscal_periods", "deleted_at")
  await queryInterface.removeColumn("funding_periods", "deleted_at")
  await queryInterface.removeColumn("funding_submission_line_jsons", "deleted_at")
  await queryInterface.removeColumn("funding_submission_lines", "deleted_at")
  await queryInterface.removeColumn("logs", "deleted_at")
  await queryInterface.removeColumn("payments", "deleted_at")
  await queryInterface.removeColumn("users", "deleted_at")
  await queryInterface.removeColumn("wage_enhancements", "deleted_at")
}
