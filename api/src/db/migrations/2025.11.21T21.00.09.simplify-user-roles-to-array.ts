import { DataTypes, sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.addColumn("users", "roles", {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: "user",
  })

  await queryInterface.sequelize.query(/* sql */ `
    UPDATE users
    SET
      roles = COALESCE(roles_aggregation.roles, '')
    FROM
      users
      LEFT JOIN (
        SELECT
          user_id,
          STRING_AGG(
            role,
            ','
          ) WITHIN GROUP (
            ORDER BY
              [role]
          ) as roles
        FROM
          user_roles
        GROUP BY
          user_id
      ) roles_aggregation ON users.id = roles_aggregation.user_id
  `)

  await queryInterface.dropTable("user_roles")
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.createTable("user_roles", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "users",
        key: "id",
      },
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: "datetime2",
      allowNull: false,
      defaultValue: sql.fn("getutcdate"),
    },
    updated_at: {
      type: "datetime2",
      allowNull: false,
      defaultValue: sql.fn("getutcdate"),
    },
  })

  await queryInterface.sequelize.query(/* sql */ `
    INSERT INTO
      user_roles (user_id, [role], created_at, updated_at)
    SELECT
      users.id as user_id,
      TRIM([value]) as [role],
      GETUTCDATE() as created_at,
      GETUTCDATE() as updated_at
    FROM
      users
      CROSS APPLY STRING_SPLIT (users.roles, ',') as split
    WHERE
      users.roles != ''
      AND TRIM([value]) != ''
  `)

  await queryInterface.removeColumn("users", "roles")
}
