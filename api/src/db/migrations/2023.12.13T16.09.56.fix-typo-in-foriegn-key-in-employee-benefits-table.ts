import { isEqual } from "lodash"

import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  const constraints = await queryInterface.showConstraints("employee_benefits", {
    columnName: "fislcal_period_id",
  })

  const constraint = constraints.find((reference) =>
    isEqual(reference.columnNames, ["fislcal_period_id"])
  )
  if (constraint !== undefined) {
    await queryInterface.removeConstraint("employee_benefits", constraint.constraintName)
  }

  await queryInterface.renameColumn("employee_benefits", "fislcal_period_id", "fiscal_period_id")

  await queryInterface.addConstraint("employee_benefits", {
    fields: ["fiscal_period_id"],
    type: "FOREIGN KEY",
    references: {
      table: "fiscal_periods",
      field: "id",
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  const constraints = await queryInterface.showConstraints("employee_benefits", {
    columnName: "fiscal_period_id",
  })

  const constraint = constraints.find((reference) =>
    isEqual(reference.columnNames, ["fiscal_period_id"])
  )
  if (constraint !== undefined) {
    await queryInterface.removeConstraint("employee_benefits", constraint.constraintName)
  }

  await queryInterface.renameColumn("employee_benefits", "fiscal_period_id", "fislcal_period_id")

  await queryInterface.addConstraint("employee_benefits", {
    fields: ["fislcal_period_id"],
    type: "FOREIGN KEY",
    references: {
      table: "fiscal_periods",
      field: "id",
    },
  })
}
