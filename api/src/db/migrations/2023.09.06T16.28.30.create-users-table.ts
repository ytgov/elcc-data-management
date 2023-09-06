import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("users", {
    email: {
      type: DataTypes.STRING(200),
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
      field: "email",
    },
    sub: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: "sub",
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name",
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "status",
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_admin",
    },
    ynetId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "ynet_id",
    },
    directoryId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "directory_id",
    },
    // Might need to changes this an use literals?
    // type: datetime2(0), default: GETDATE()
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "create_date",
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("users")
}
