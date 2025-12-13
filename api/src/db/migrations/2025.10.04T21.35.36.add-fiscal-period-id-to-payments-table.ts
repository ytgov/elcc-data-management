import { DataTypes } from "@sequelize/core"

import { type Migration } from "@/db/umzug"

export async function up({ context: queryInterface }: Migration) {
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
      fiscal_period_id = matched_fiscal_periods.id
    FROM
      payments
      CROSS APPLY (
        SELECT
          TOP 1 fiscal_periods.id
        FROM
          fiscal_periods
        WHERE
          CAST(payments.paid_on AS date) >= CAST(fiscal_periods.date_start AS date)
          AND CAST(payments.paid_on AS date) <= CAST(fiscal_periods.date_end AS date)
        ORDER BY
          fiscal_periods.date_start ASC
      ) AS matched_fiscal_periods
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

export async function down({ context: queryInterface }: Migration) {
  await queryInterface.removeColumn("payments", "fiscal_period_id")
}
