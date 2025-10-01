import { DataTypes } from "@sequelize/core"

import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("user_roles", {
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      references: {
        model: "users",
        key: "email",
      },
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("user_roles")
}
