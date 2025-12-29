import { sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"
import { removeConstraint } from "@/db/utils/mssql-remove-constraint"

/**
 * NOTE: Sequelize doesn't seem to be able to handle changeColumn with default constraint with MSSQL.
 * So you need to:
 *   1. Remove the existing default constraint, via custom function
 *   2. Change the column type
 *   3. Add the new default constraint
 */
export async function up({ context: queryInterface }: Migration) {
  // centres
  await removeConstraint(queryInterface, "centres", { type: "DEFAULT", fields: ["created_at"] })
  await queryInterface.changeColumn("centres", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("centres", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "centres", { type: "DEFAULT", fields: ["updated_at"] })
  await queryInterface.changeColumn("centres", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("centres", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })

  // employee_benefits
  await removeConstraint(queryInterface, "employee_benefits", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("employee_benefits", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("employee_benefits", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "employee_benefits", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("employee_benefits", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("employee_benefits", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })

  // employee_wage_tiers
  await removeConstraint(queryInterface, "employee_wage_tiers", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("employee_wage_tiers", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("employee_wage_tiers", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "employee_wage_tiers", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("employee_wage_tiers", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("employee_wage_tiers", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })

  // fiscal_periods
  await removeConstraint(queryInterface, "fiscal_periods", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("fiscal_periods", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("fiscal_periods", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "fiscal_periods", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("fiscal_periods", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("fiscal_periods", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })

  // funding_periods
  await removeConstraint(queryInterface, "funding_periods", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("funding_periods", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_periods", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "funding_periods", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("funding_periods", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_periods", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })

  // funding_submission_line_jsons
  await removeConstraint(queryInterface, "funding_submission_line_jsons", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("funding_submission_line_jsons", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_submission_line_jsons", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "funding_submission_line_jsons", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("funding_submission_line_jsons", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_submission_line_jsons", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })

  // funding_submission_lines
  await removeConstraint(queryInterface, "funding_submission_lines", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("funding_submission_lines", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_submission_lines", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "funding_submission_lines", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("funding_submission_lines", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_submission_lines", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })

  // logs
  await removeConstraint(queryInterface, "logs", { type: "DEFAULT", fields: ["created_at"] })
  await queryInterface.changeColumn("logs", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("logs", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "logs", { type: "DEFAULT", fields: ["updated_at"] })
  await queryInterface.changeColumn("logs", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("logs", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })

  // payments
  await removeConstraint(queryInterface, "payments", { type: "DEFAULT", fields: ["created_at"] })
  await queryInterface.changeColumn("payments", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("payments", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "payments", { type: "DEFAULT", fields: ["updated_at"] })
  await queryInterface.changeColumn("payments", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("payments", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })

  // users
  await removeConstraint(queryInterface, "users", { type: "DEFAULT", fields: ["created_at"] })
  await queryInterface.changeColumn("users", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("users", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "users", { type: "DEFAULT", fields: ["updated_at"] })
  await queryInterface.changeColumn("users", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("users", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })

  // wage_enhancements
  await removeConstraint(queryInterface, "wage_enhancements", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("wage_enhancements", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("wage_enhancements", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getutcdate"),
  })
  await removeConstraint(queryInterface, "wage_enhancements", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("wage_enhancements", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("wage_enhancements", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getutcdate"),
  })
}

export async function down({ context: queryInterface }: Migration) {
  // centres
  await removeConstraint(queryInterface, "centres", { type: "DEFAULT", fields: ["created_at"] })
  await queryInterface.changeColumn("centres", "created_at", {
    type: "datetime2(0)",
    allowNull: false,
  })
  await queryInterface.addConstraint("centres", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "centres", { type: "DEFAULT", fields: ["updated_at"] })
  await queryInterface.changeColumn("centres", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("centres", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })

  // employee_benefits
  await removeConstraint(queryInterface, "employee_benefits", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("employee_benefits", "created_at", {
    type: "datetime2(0)",
    allowNull: false,
  })
  await queryInterface.addConstraint("employee_benefits", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "employee_benefits", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("employee_benefits", "updated_at", {
    type: "datetime2(0)",
    allowNull: false,
  })
  await queryInterface.addConstraint("employee_benefits", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })

  // employee_wage_tiers
  await removeConstraint(queryInterface, "employee_wage_tiers", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("employee_wage_tiers", "created_at", {
    type: "datetime2(0)",
    allowNull: false,
  })
  await queryInterface.addConstraint("employee_wage_tiers", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "employee_wage_tiers", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("employee_wage_tiers", "updated_at", {
    type: "datetime2(0)",
    allowNull: false,
  })
  await queryInterface.addConstraint("employee_wage_tiers", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })

  // fiscal_periods
  await removeConstraint(queryInterface, "fiscal_periods", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("fiscal_periods", "created_at", {
    type: "datetime2(0)",
    allowNull: false,
  })
  await queryInterface.addConstraint("fiscal_periods", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "fiscal_periods", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("fiscal_periods", "updated_at", {
    type: "datetime2(0)",
    allowNull: false,
  })
  await queryInterface.addConstraint("fiscal_periods", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })

  // funding_periods
  await removeConstraint(queryInterface, "funding_periods", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("funding_periods", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_periods", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "funding_periods", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("funding_periods", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_periods", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })

  // funding_submission_line_jsons
  await removeConstraint(queryInterface, "funding_submission_line_jsons", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("funding_submission_line_jsons", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_submission_line_jsons", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "funding_submission_line_jsons", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("funding_submission_line_jsons", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_submission_line_jsons", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })

  // funding_submission_lines
  await removeConstraint(queryInterface, "funding_submission_lines", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("funding_submission_lines", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_submission_lines", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "funding_submission_lines", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("funding_submission_lines", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("funding_submission_lines", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })

  // logs
  await removeConstraint(queryInterface, "logs", { type: "DEFAULT", fields: ["created_at"] })
  await queryInterface.changeColumn("logs", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("logs", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "logs", { type: "DEFAULT", fields: ["updated_at"] })
  await queryInterface.changeColumn("logs", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("logs", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })

  // payments
  await removeConstraint(queryInterface, "payments", { type: "DEFAULT", fields: ["created_at"] })
  await queryInterface.changeColumn("payments", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("payments", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "payments", { type: "DEFAULT", fields: ["updated_at"] })
  await queryInterface.changeColumn("payments", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("payments", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })

  // users
  await removeConstraint(queryInterface, "users", { type: "DEFAULT", fields: ["created_at"] })
  await queryInterface.changeColumn("users", "created_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("users", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "users", { type: "DEFAULT", fields: ["updated_at"] })
  await queryInterface.changeColumn("users", "updated_at", {
    type: "datetime2",
    allowNull: false,
  })
  await queryInterface.addConstraint("users", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })

  // wage_enhancements
  await removeConstraint(queryInterface, "wage_enhancements", {
    type: "DEFAULT",
    fields: ["created_at"],
  })
  await queryInterface.changeColumn("wage_enhancements", "created_at", {
    type: "datetime2(0)",
    allowNull: false,
  })
  await queryInterface.addConstraint("wage_enhancements", {
    type: "DEFAULT",
    fields: ["created_at"],
    defaultValue: sql.fn("getdate"),
  })
  await removeConstraint(queryInterface, "wage_enhancements", {
    type: "DEFAULT",
    fields: ["updated_at"],
  })
  await queryInterface.changeColumn("wage_enhancements", "updated_at", {
    type: "datetime2(0)",
    allowNull: false,
  })
  await queryInterface.addConstraint("wage_enhancements", {
    type: "DEFAULT",
    fields: ["updated_at"],
    defaultValue: sql.fn("getdate"),
  })
}
