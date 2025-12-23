import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

import { removeConstraint } from "@/db/utils/mssql-remove-constraint"

export async function up({ context: queryInterface }: Migration) {
  await removeConstraint(queryInterface, "user_roles", {
    fields: ["email"],
    type: "FOREIGN KEY",
  })
  await removeConstraint(queryInterface, "users", {
    fields: ["email"],
    type: "PRIMARY KEY",
  })
  await queryInterface.addConstraint("users", {
    fields: ["email"],
    type: "UNIQUE",
  })
  await queryInterface.addConstraint("user_roles", {
    fields: ["email"],
    type: "FOREIGN KEY",
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

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeColumn("users", "id")
  await removeConstraint(queryInterface, "user_roles", {
    fields: ["email"],
    type: "FOREIGN KEY",
  })
  await removeConstraint(queryInterface, "users", {
    fields: ["email"],
    type: "UNIQUE",
  })
  await queryInterface.addConstraint("users", {
    fields: ["email"],
    type: "PRIMARY KEY",
  })
  await queryInterface.addConstraint("user_roles", {
    fields: ["email"],
    type: "FOREIGN KEY",
    references: {
      table: "users",
      field: "email",
    },
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
}
