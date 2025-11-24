import { DataTypes, sql } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
  await queryInterface.dropTable("funding_submission_line_values")
}

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.createTable("funding_submission_line_values", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    centre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "centres",
        key: "id",
      },
    },
    submission_line_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        table: "funding_submission_lines",
        key: "id",
      },
    },
    fiscal_year: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    section_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    line_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    monthly_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    date_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date_start: {
      type: "datetime2(0)",
      allowNull: false,
    },
    date_end: {
      type: "datetime2(0)",
      allowNull: false,
    },
    child_count: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    computed_total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    is_actual: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: "datetime2",
      allowNull: false,
      defaultValue: sql.fn("GETDATE"),
    },
    updated_at: {
      type: "datetime2",
      allowNull: false,
      defaultValue: sql.fn("GETDATE"),
    },
  })
}
