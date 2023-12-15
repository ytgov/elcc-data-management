import type { Migration } from "@/db/umzug"

type ForeignKeyReference = {
  constraint_name: string // "FK__employee___fislc__22401542"
  constraintName: string // "FK__employee___fislc__22401542"
  constraintCatalog: string // "elcc_development"
  constraintSchema: string // "dbo"
  tableName: string // "employee_benefits"
  tableSchema: string // "dbo"
  tableCatalog: string // "elcc_development"
  columnName: string // "fislcal_period_id"
  referencedTableSchema: string // "dbo"
  referencedCatalog: string // "elcc_development"
  referencedTableName: string // "fiscal_periods"
  referencedColumnName: string // "id"
}

export const up: Migration = async ({ context: queryInterface }) => {
  const references = (await queryInterface.getForeignKeyReferencesForTable(
    "employee_benefits"
  )) as ForeignKeyReference[]

  const foreignKey = references.find((reference) => reference.columnName === "fislcal_period_id")
  if (foreignKey !== undefined) {
    await queryInterface.removeConstraint("employee_benefits", foreignKey.constraintName)
  }

  await queryInterface.renameColumn("employee_benefits", "fislcal_period_id", "fiscal_period_id")

  await queryInterface.addConstraint("employee_benefits", {
    fields: ["fiscal_period_id"],
    type: "foreign key",
    references: {
      table: "fiscal_periods",
      field: "id",
    },
    onDelete: "", // RESTRICT is default for MSSQL, so you can't set it; and must use and empty string
    onUpdate: "",
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  const references = (await queryInterface.getForeignKeyReferencesForTable(
    "employee_benefits"
  )) as ForeignKeyReference[]

  const foreignKey = references.find((reference) => reference.columnName === "fiscal_period_id")
  if (foreignKey !== undefined) {
    await queryInterface.removeConstraint("employee_benefits", foreignKey.constraintName)
  }

  await queryInterface.renameColumn("employee_benefits", "fiscal_period_id", "fislcal_period_id")

  await queryInterface.addConstraint("employee_benefits", {
    fields: ["fislcal_period_id"],
    type: "foreign key",
    references: {
      table: "fiscal_periods",
      field: "id",
    },
    onDelete: "", // RESTRICT is default for MSSQL, so you can't set it; and must use and empty string
    onUpdate: "",
  })
}
