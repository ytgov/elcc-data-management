import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"

import { removeConstraint } from "@/db/utils/mssql-drop-constraint"

export const up: Migration = async ({ context: queryInterface }) => {
  await removeConstraint(queryInterface, "user_roles", {
    fields: ["email"],
    type: "foreign key",
  })
  await removeConstraint(queryInterface, "users", {
    fields: ["email"],
    type: "primary key",
  })
  await queryInterface.addConstraint("users", {
    fields: ["email"],
    type: "unique",
  })
  await queryInterface.addConstraint("user_roles", {
    fields: ["email"],
    type: "foreign key",
    references: {
      table: "users",
      field: "email",
    },
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })

  await queryInterface.addColumn("users", "id", {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("users", "id")
  await removeConstraint(queryInterface, "user_roles", {
    fields: ["email"],
    type: "foreign key",
  })
  await removeConstraint(queryInterface, "users", {
    fields: ["email"],
    type: "unique",
  })
  await queryInterface.addConstraint("users", {
    fields: ["email"],
    type: "primary key",
  })
  await queryInterface.addConstraint("user_roles", {
    fields: ["email"],
    type: "foreign key",
    references: {
      table: "users",
      field: "email",
    },
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
}
