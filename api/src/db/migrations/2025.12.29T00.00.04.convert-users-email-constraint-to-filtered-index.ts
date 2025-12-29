import { type Migration } from "@/db/umzug"
import { removeConstraint } from "@/db/utils/mssql-remove-constraint"

export async function up({ context: queryInterface }: Migration) {
  await removeConstraint(queryInterface, "users", {
    type: "UNIQUE",
    fields: ["email"],
  })

  await queryInterface.addIndex("users", ["email"], {
    name: "users_on_email_unique",
    unique: true,
    where: {
      deleted_at: null,
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeIndex("users", "users_on_email_unique")

  await queryInterface.addConstraint("users", {
    fields: ["email"],
    type: "UNIQUE",
  })
}
