import { DataTypes } from "@sequelize/core"

import type { Migration } from "@/db/umzug"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("payments", "fiscal_period_id", {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      table: "fiscal_periods",
      key: "id",
    },
  })

  await queryInterface.sequelize.query(/* sql */ `
    UPDATE payments
    SET
      fiscal_period_id = fiscal_periods.id
    FROM
      fiscal_periods
    WHERE
      payments.paid_on >= fiscal_periods.date_start
      AND payments.paid_on < fiscal_periods.date_end
  `)

  await queryInterface.changeColumn("payments", "fiscal_period_id", {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      table: "fiscal_periods",
      key: "id",
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("payments", "fiscal_period_id")
}
