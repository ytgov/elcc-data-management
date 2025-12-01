import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  // 1. Update payments table: rename amount_in_cents to amount and change from INTEGER to DECIMAL(15, 4)
  // First add the new column
  await queryInterface.addColumn("payments", "amount", {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: true,
  })

  // Migrate data: convert cents to dollars
  await queryInterface.sequelize.query(/* sql */ `
    UPDATE payments
    SET
      amount = CAST(amount_in_cents AS DECIMAL(15, 4)) / CAST(100 AS DECIMAL(15, 4))
    WHERE
      amount_in_cents IS NOT NULL
  `)

  // Make the new column NOT NULL
  await queryInterface.changeColumn("payments", "amount", {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
  })

  // Drop the old column
  await queryInterface.removeColumn("payments", "amount_in_cents")

  // 2. Update employee_wage_tiers table: change wage_rate_per_hour from FLOAT to DECIMAL(10, 4)
  await queryInterface.changeColumn("employee_wage_tiers", "wage_rate_per_hour", {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
  })

  // 3. Update funding_submission_lines table: change monthly_amount from FLOAT to DECIMAL(15, 4)
  await queryInterface.changeColumn("funding_submission_lines", "monthly_amount", {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
  })

  // 4. Update employee_benefits table: change all money fields from DECIMAL(10, 2) to DECIMAL(10, 4)
  await queryInterface.changeColumn("employee_benefits", "gross_payroll_monthly_actual", {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
  })

  await queryInterface.changeColumn("employee_benefits", "gross_payroll_monthly_estimated", {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
  })

  await queryInterface.changeColumn("employee_benefits", "employee_cost_actual", {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
  })

  await queryInterface.changeColumn("employee_benefits", "employee_cost_estimated", {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
  })

  await queryInterface.changeColumn("employee_benefits", "employer_cost_actual", {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
  })

  await queryInterface.changeColumn("employee_benefits", "employer_cost_estimated", {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false,
  })
}

export async function down({ context: queryInterface }: Migration) {
  // Reverse the changes in opposite order

  // 4. Revert employee_benefits table money fields from DECIMAL(10, 4) back to DECIMAL(10, 2)
  await queryInterface.changeColumn("employee_benefits", "employer_cost_estimated", {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  })

  await queryInterface.changeColumn("employee_benefits", "employer_cost_actual", {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  })

  await queryInterface.changeColumn("employee_benefits", "employee_cost_estimated", {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  })

  await queryInterface.changeColumn("employee_benefits", "employee_cost_actual", {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  })

  await queryInterface.changeColumn("employee_benefits", "gross_payroll_monthly_estimated", {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  })

  await queryInterface.changeColumn("employee_benefits", "gross_payroll_monthly_actual", {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  })

  // 3. Revert funding_submission_lines table: change monthly_amount from DECIMAL(15, 4) back to FLOAT
  await queryInterface.changeColumn("funding_submission_lines", "monthly_amount", {
    type: DataTypes.FLOAT,
    allowNull: false,
  })

  // 2. Revert employee_wage_tiers table: change wage_rate_per_hour from DECIMAL(10, 4) back to FLOAT
  await queryInterface.changeColumn("employee_wage_tiers", "wage_rate_per_hour", {
    type: DataTypes.FLOAT,
    allowNull: false,
  })

  // 1. Revert payments table: add back amount_in_cents and remove amount
  // Add the old column back
  await queryInterface.addColumn("payments", "amount_in_cents", {
    type: DataTypes.INTEGER,
    allowNull: true,
  })

  // Migrate data: convert dollars back to cents
  await queryInterface.sequelize.query(/* sql */ `
    UPDATE payments
    SET
      amount_in_cents = CAST(ROUND(amount * 100, 0) AS INT)
    WHERE
      amount IS NOT NULL
  `)

  // Make the old column NOT NULL
  await queryInterface.changeColumn("payments", "amount_in_cents", {
    type: DataTypes.INTEGER,
    allowNull: false,
  })

  // Drop the new column
  await queryInterface.removeColumn("payments", "amount")
}
