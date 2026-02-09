import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  try {
    await queryInterface.removeIndex(
      "employee_benefits",
      "employee_benefits_centre_id_fiscal_period_id_unique"
    )
  } catch (error) {
    console.debug(
      `Aligning production and development environments: employee_benefits_centre_id_fiscal_period_id_unique index does not exist: ${error}`,
      { error }
    )
  }

  try {
    await queryInterface.removeIndex(
      "employee_benefits",
      "employee_benefits_centre_id_fiscal_period_id"
    )
  } catch (error) {
    console.debug(
      `Aligning production and development environments: employee_benefits_centre_id_fiscal_period_id index does not exist: ${error}`,
      { error }
    )
  }

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

  // Delete duplicate records, keeping only the one with the smallest id for each centre_id/fiscal_period_id pair
  await queryInterface.sequelize.query(/* sql */ `
    DELETE FROM employee_benefits
    WHERE
      id NOT IN (
        SELECT
          MIN(id)
        FROM
          employee_benefits
        GROUP BY
          centre_id,
          fiscal_period_id
      )
  `)

  await queryInterface.addIndex("employee_benefits", ["centre_id", "fiscal_period_id"], {
    name: "employee_benefits_centre_id_fiscal_period_id_unique",
    unique: true,
  })
}
