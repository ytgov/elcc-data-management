import { DataTypes } from "sequelize"

import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("funding_submission_line_value")
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("funding_submission_line_value", {
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
        model: "centres",
        key: "id",
      },
    },
    submission_line_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "funding_submission_lines",
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
    // TODO: migrate column to integer cents, see https://github.com/icefoganalytics/elcc-data-management/issues/33
    monthly_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // TODO: migrate column to integer; partial children are not possible
    child_count: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // TODO: migrate column to integer cents, see https://github.com/icefoganalytics/elcc-data-management/issues/33
    computed_total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    is_actual: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: MssqlSimpleTypes.DATETIME2(),
      allowNull: false,
      defaultValue: MssqlSimpleTypes.NOW,
    },
    updated_at: {
      type: MssqlSimpleTypes.DATETIME2(),
      allowNull: false,
      defaultValue: MssqlSimpleTypes.NOW,
    },
  })
}
