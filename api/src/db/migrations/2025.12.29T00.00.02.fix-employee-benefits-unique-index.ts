import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.removeIndex(
    "employee_benefits",
    "employee_benefits_centre_id_fiscal_period_id_unique"
  )

  await queryInterface.addIndex("employee_benefits", ["centre_id", "fiscal_period_id"], {
    name: "employee_benefits_centre_id_fiscal_period_id_unique",
    unique: true,
    where: {
      deleted_at: null,
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeIndex(
    "employee_benefits",
    "employee_benefits_centre_id_fiscal_period_id_unique"
  )

  await queryInterface.addIndex("employee_benefits", ["centre_id", "fiscal_period_id"], {
    name: "employee_benefits_centre_id_fiscal_period_id_unique",
    unique: true,
  })
}
