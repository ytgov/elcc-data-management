import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.createTable("user_roles", {
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      references: {
        table: "users",
        key: "email",
      },
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  })
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("user_roles")
}
