import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.renameColumn(
    "building_expenses",
    "building_expense_category_id",
    "category_id"
  )
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.renameColumn(
    "building_expenses",
    "category_id",
    "building_expense_category_id"
  )
}
