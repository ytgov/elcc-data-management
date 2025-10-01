import { DataTypes } from "@sequelize/core"

import type { Migration } from "@/db/umzug"
import { removeConstraint } from "@/db/utils/mssql-drop-constraint"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("user_roles", "user_id", {
    type: DataTypes.INTEGER,
  })

  await queryInterface.sequelize.query(
    `
    UPDATE
      user_roles
    SET
      user_roles.user_id = users.id
    FROM
      user_roles
      INNER JOIN users ON user_roles.email = users.email;
    `
  )

  await queryInterface.changeColumn("user_roles", "user_id", {
    type: DataTypes.INTEGER,
    allowNull: false,
  })

  await removeConstraint(queryInterface, "user_roles", {
    fields: ["email"],
    type: "FOREIGN KEY",
  })
  await queryInterface.removeColumn("user_roles", "email")

  await queryInterface.addConstraint("user_roles", {
    fields: ["user_id"],
    type: "FOREIGN KEY",
    references: {
      table: "users",
      field: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("user_roles", "email", {
    type: DataTypes.STRING(200),
  })

  await queryInterface.sequelize.query(
    `
    UPDATE
      user_roles
    SET
      user_roles.email = users.email
    FROM
      user_roles
      INNER JOIN users ON user_roles.user_id = users.id;
    `
  )

  await queryInterface.changeColumn("user_roles", "email", {
    type: DataTypes.STRING(200),
    allowNull: false,
  })

  await removeConstraint(queryInterface, "user_roles", {
    fields: ["user_id"],
    type: "FOREIGN KEY",
  })
  await queryInterface.removeColumn("user_roles", "user_id")

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
